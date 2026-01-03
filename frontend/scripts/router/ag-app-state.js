class AppState {
    constructor() {
        // Хэрэглэгчийн аяллын төлөвлөгөөнд нэмсэн газруудын жагсаалт
        this.planItems = [];
        // spot-info хуудаст одоо харуулж байгаа газар
        this.currentSpot = null;

        // API-аас татсан газрын өгөгдөл
        this.spotData = {};

        // API-аас татсан хөтөчдийн өгөгдөл
        this.guideData = {};

        // Апп эхлэхэд backend болон localStorage-оос өгөгдөл ачаалах
        this.loadSpotData();
        this.loadGuideData();
        this.loadPlanFromBackend();
    }

    /**
     * @returns {string} - Хэрэглэгчийн unique ID
     */
    getUserId() {
        // Эхлээд cookie-ээс ID-г хайх
        let userId = this.getCookie('ayalgo-userId');

        // Cookie-д байхгүй бол localStorage-оос хайх
        if (!userId) {
            userId = localStorage.getItem('ayalgo-userId');
        }

        // Хоёуланд нь байхгүй бол шинээр үүсгэх
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
        }

        // Cookie болон localStorage-д хадгалах
        this.setCookie('ayalgo-userId', userId, 30);
        localStorage.setItem('ayalgo-userId', userId);

        return userId;
    }

    /**
     * Cookie утга авах
     * @param {string} name - Cookie-ийн нэр
     * @returns {string|null} - Cookie-ийн утга, эсвэл null
     */
    getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length);
            }
        }
        return null;
    }

    /**
     * Cookie тохируулах
     * @param {string} name - Cookie-ийн нэр
     * @param {string} value - Cookie-ийн утга
     * @param {number} days - Хэдэн хоног хадгалах 
     */
    setCookie(name, value, days = 30) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        // SameSite=Lax нь CSRF халдлагаас хамгаална
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }

    //Backend-аас аяллын төлөвлөгөө ачаалах, амжилтгүй бол localStorage-оос ачаална.
    async loadPlanFromBackend() {
        try {
            const userId = this.getUserId();
            const response = await fetch(`http://localhost:3000/api/plans/${userId}/spots`);
            const data = await response.json();

            if (data.spots && data.spots.length > 0) {
                // Backend-ээс ирсэн spot өгөгдлийг frontend форматруу хөрвүүлэх
                // spot.name нь аль хэдийн customTitle эсвэл анхны нэрийг агуулна
                this.planItems = data.spots.map((spot, idx) => ({
                    id: spot.spotId,
                    number: idx + 1,
                    title: spot.name.toUpperCase(), // Backend-ээс customTitle эсвэл name ирнэ
                    rating: spot.rating.toString(),
                    cate: spot.category,
                    status: spot.status,
                    time: spot.openingHours,
                    img1: spot.imgMainUrl,
                    img2: spot.img2Url || spot.imgMainUrl,
                    img3: spot.img3Url || spot.imgMainUrl,
                    region: spot.area,
                    location: spot.detailLocation,
                    age: spot.ageRange,
                    price: spot.priceText,
                    schedule: spot.openingHours,
                    description: spot.descriptionLong,
                    activities: spot.activities.join(', '),
                    mapSrc: spot.mapSrc
                }));

                this.savePlanToStorage();
                this.dispatchStateChange('planItems', this.planItems);
            } else {
                // Backend дээр өгөгдөл байхгүй бол localStorage-оос ачаалах
                this.planItems = this.loadPlanFromStorage();
            }
        } catch (error) {
            console.error('Error loading plan from backend:', error);
            // Backend алдаа гарвал localStorage-оос ачаална
            this.planItems = this.loadPlanFromStorage();
        }
    }

    // Газруудын өгөгдлийг Backend API-аас ачаалах
    async loadSpotData() {
        try {
            const response = await fetch('http://localhost:3000/api/spots');
            const data = await response.json();

            // Backend өгөгдлийг frontend форматруу хөрвүүлж, spotData object-д хадгалах
            data.spots.forEach(spot => {
                const id = spot.spotId;
                this.spotData[id] = {
                    id: id,
                    title: spot.name.toUpperCase(),
                    rating: spot.rating.toString(),
                    cate: spot.category,
                    status: spot.status,
                    time: spot.openingHours,
                    img1: spot.imgMainUrl,
                    img2: spot.img2Url || spot.imgMainUrl,
                    img3: spot.img3Url || spot.imgMainUrl,
                    region: spot.area,
                    location: spot.detailLocation,
                    age: spot.ageRange,
                    price: spot.priceText,
                    schedule: spot.scheduleFull || spot.openingHours,
                    description: spot.descriptionLong,
                    activities: spot.activities.join(', '),
                    mapSrc: spot.mapSrc
                };
            });

            console.log('Spot data ачаалагдлаа:', Object.keys(this.spotData).length, 'газар');
            console.log('Бүс нутгууд:', [...new Set(Object.values(this.spotData).map(s => s.region))].sort());

            // Бүх component-үүдэд мэдэгдэл илгээх
            this.dispatchStateChange('spotData', this.spotData);
        } catch (error) {
            console.error('Error loading spot data:', error);
        }
    }

    //Хөтөчдийн өгөгдлийг Backend API-аас ачаалах
    async loadGuideData() {
        try {
            const response = await fetch('http://localhost:3000/api/guides');
            const data = await response.json();

            // Backend өгөгдөл хоосон эсэхийг шалгах
            if (!data.guides || data.guides.length === 0) {
                console.log('Backend хөтөч хоосон байна, JSON файлаас ачаална...');
                this.loadGuideDataFromJSON();
                return;
            }

            // Backend өгөгдлийг frontend форматруу хөрвүүлж, guideData object-д хадгалах
            data.guides.forEach(guide => {
                this.guideData[guide.guideId] = {
                    id: guide.guideId,
                    lastName: guide.lastName,
                    firstName: guide.firstName,
                    fullName: `${guide.lastName} ${guide.firstName}`,
                    phone: guide.phone,
                    email: guide.email,
                    area: guide.area,
                    category: guide.category,
                    languages: guide.languages ? guide.languages.split(',').map(l => l.trim()) : [],
                    experience: guide.experienceLevel,
                    profileImg: guide.profileImgUrl || './assets/images/guide-img/default-profile.svg',
                };
            });

            console.log('Guide data ачаалагдлаа:', Object.keys(this.guideData).length, 'хөтөч');

            // Бүх component-үүдэд мэдэгдэл илгээх
            this.dispatchStateChange('guideData', this.guideData);
        } catch (error) {
            console.error('Error loading guide data:', error);
            // Backend амжилтгүй бол JSON файлаас ачаална
            this.loadGuideDataFromJSON();
        }
    }

    //Хөтөчдийн өгөгдлийг JSON файлаас ачаалах, backend API алдаатай үед ашиглагдана
    async loadGuideDataFromJSON() {
        try {
            const response = await fetch('./data/guides.json');
            const data = await response.json();

            data.guides.forEach(guide => {
                this.guideData[guide.guideId] = {
                    id: guide.guideId,
                    lastName: guide.lastName,
                    firstName: guide.firstName,
                    fullName: `${guide.lastName} ${guide.firstName}`,
                    phone: guide.phone,
                    email: guide.email,
                    area: guide.area,
                    category: guide.category,
                    languages: guide.language,
                    experience: guide.experienceLevel,
                    profileImg: guide.profileImgUrl || './assets/images/guide-img/default-profile.svg',
                };
            });

            console.log('Guide data (JSON) ачаалагдлаа:', Object.keys(this.guideData).length, 'хөтөч');

            this.dispatchStateChange('guideData', this.guideData);
        } catch (error) {
            console.error('Error loading guide data from JSON:', error);
        }
    }

    /**
     * Газрын мэдээллийг ID-аар нь олох
     * @param {string|number} spotId 
     * @returns {Object|undefined}
     */
    getSpot(spotId) {
        return this.spotData[spotId];
    }

    /**
     * Бүх газруудын жагсаалт авах
     * @returns {Array} - Газруудын array
     */
    getAllSpots() {
        return Object.values(this.spotData);
    }

    /**
     * Хөтөчийн мэдээллийг ID-аар нь олох
     * @param {string|number} guideId - Хөтөчийн ID
     * @returns {Object|undefined} - Хөтөчийн дэлгэрэнгүй мэдээлэл
     */
    getGuide(guideId) {
        return this.guideData[guideId];
    }

    /**
     * Бүх хөтөчдийн жагсаалт авах
     * @returns {Array} - Хөтөчдийн array
     */
    getAllGuides() {
        return Object.values(this.guideData);
    }

    /**
     * spot-info хуудаст ашиглагдана
     * @param {string|number} spotId - Газрын ID
     */
    setCurrentSpot(spotId) {
        this.currentSpot = this.spotData[spotId];
        this.dispatchStateChange('currentSpot', this.currentSpot);
    }

    /**
     * localStorage-оос аяллын төлөвлөгөө ачаалах
     * @returns {Array} - Төлөвлөгөөний жагсаалт
     */
    loadPlanFromStorage() {
        try {
            const saved = localStorage.getItem('ayalgo-planItems');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading plan from storage:', error);
        }
        return [];
    }

    /**
     * Аяллын төлөвлөгөөг localStorage-д хадгалах
     */
    savePlanToStorage() {
        try {
            localStorage.setItem('ayalgo-planItems', JSON.stringify(this.planItems));
        } catch (error) {
            console.error('Error saving plan to storage:', error);
        }
    }

    /**
     * Газрыг аяллын төлөвлөгөөнд нэмэх
     * Backend DB болон localStorage-д хадгална
     * @param {string|number} spotId - Газрын ID
     * @returns {boolean|string} - true: амжилттай, 'exists': аль хэдийн байгаа, false: алдаа
     */
    async addToPlan(spotId) {
        const spot = this.getSpot(spotId);
        if (!spot) return false;

        // Аль хэдийн төлөвлөгөөнд байгаа эсэхийг шалгах
        const exists = this.planItems.some(item => item.id === spotId);
        if (exists) {
            return 'exists';
        }

        // Backend-д хадгалах (амжилтгүй бол localStorage-д хадгална)
        try {
            const userId = this.getUserId();
            const response = await fetch(`http://localhost:3000/api/plans/${userId}/spots`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ spotId })
            });

            const data = await response.json();

            if (response.status === 409 && data.error === 'exists') {
                return 'exists';
            }

            if (!response.ok) {
                console.error('Failed to add spot to plan:', data);
            }
        } catch (error) {
            console.error('Error adding spot to plan:', error);
        }

        // Local state-д нэмэх
        this.planItems.push({
            id: spotId,
            number: this.planItems.length + 1,
            ...spot
        });

        this.savePlanToStorage();
        this.dispatchStateChange('planItems', this.planItems);
        return true;
    }

    /**
     * Газрыг аяллын төлөвлөгөөнөөс хасах
     * Backend DB болон localStorage-оос арилгана
     * @param {string|number} spotId - Газрын ID
     * @returns {boolean} - Амжилттай эсэх
     */
    async removeFromPlan(spotId) {
        // getAttribute нь string буцаадаг тул string рүү хөрвүүлэх
        const spotIdStr = String(spotId);
        const index = this.planItems.findIndex(item => String(item.id) === spotIdStr);

        if (index === -1) return false;

        // Backend DB-ээс устгах (амжилтгүй бол localStorage-д хэвийн устгана)
        try {
            const userId = this.getUserId();
            const response = await fetch(`http://localhost:3000/api/plans/${userId}/spots/${spotIdStr}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                console.error('Failed to remove spot from plan');
            }
        } catch (error) {
            console.error('Error removing spot from plan:', error);
        }

        // Local state-ээс устгах
        this.planItems.splice(index, 1);
        // Дугаараар нь дахин тохируулах
        this.planItems.forEach((item, idx) => {
            item.number = idx + 1;
        });
        this.savePlanToStorage();
        this.dispatchStateChange('planItems', this.planItems);
        return true;
    }

    /**
     * Аяллын төлөвлөгөөг бүхэлд нь цэвэрлэх
     * Backend DB болон localStorage-оос бүх газруудыг устгана
     * @returns {boolean} - Амжилттай эсэх
     */
    async clearPlan() {
        // Backend DB-ээс цэвэрлэх
        try {
            const userId = this.getUserId();
            const response = await fetch(`http://localhost:3000/api/plans/${userId}/spots`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                console.error('Failed to clear plan');
                return false;
            }

            // Local state цэвэрлэх
            this.planItems = [];
            this.savePlanToStorage();
            this.dispatchStateChange('planItems', this.planItems);
            return true;
        } catch (error) {
            console.error('Error clearing plan:', error);
            return false;
        }
    }

    /**
     * Аяллын төлөвлөгөөний бүх газруудыг авах
     * @returns {Array} - Төлөвлөгөөний жагсаалт
     */
    getPlanItems() {
        return this.planItems;
    }

    /**
     * Төлөвлөгөөнд байгаа газрын нэр шинэчлэх
     * Backend DB болон localStorage-д хадгална
     * @param {string|number} spotId - Газрын ID
     * @param {string} customTitle - Шинэ нэр
     * @returns {boolean} - Амжилттай эсэх
     */
    async updateSpotTitle(spotId, customTitle) {
        try {
            const userId = this.getUserId();
            const response = await fetch(`http://localhost:3000/api/plans/${userId}/spots/${spotId}/title`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customTitle })
            });

            if (!response.ok) {
                console.error('Failed to update spot title');
                return false;
            }

            // Local state-д шинэчлэх
            const item = this.planItems.find(item => String(item.id) === String(spotId));
            if (item) {
                item.title = customTitle;
                this.savePlanToStorage();
                this.dispatchStateChange('planItems', this.planItems);
            }

            return true;
        } catch (error) {
            console.error('Error updating spot title:', error);
            return false;
        }
    }

    /**
     * Төлөвлөгөөнд байгаа газрын тайлбар шинэчлэх
     * Backend DB болон localStorage-д хадгална
     * @param {string|number} spotId - Газрын ID
     * @param {string} description - Шинэ тайлбар
     * @returns {boolean} - Амжилттай эсэх
     */
    async updateSpotDescription(spotId, description) {
        try {
            const userId = this.getUserId();
            const response = await fetch(`http://localhost:3000/api/plans/${userId}/spots/${spotId}/description`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description })
            });

            if (!response.ok) {
                console.error('Failed to update spot description');
                return false;
            }

            // Local state-д шинэчлэх
            const item = this.planItems.find(item => String(item.id) === String(spotId));
            if (item) {
                item.description = description;
                this.savePlanToStorage();
                this.dispatchStateChange('planItems', this.planItems);
            }

            return true;
        } catch (error) {
            console.error('Error updating spot description:', error);
            return false;
        }
    }

    /**
     * Төлөв өөрчлөгдсөн тухай бүх component-үүдэд мэдэгдэл илгээх
     * Component-үүд 'appstatechange' event сонсож байж өгөгдөл шинэчлэнэ
     * @param {string} key - Өөрчлөгдсөн property-ийн нэр
     * @param {any} value - Шинэ утга
     */
    dispatchStateChange(key, value) {
        window.dispatchEvent(new CustomEvent('appstatechange', {
            detail: { key, value }
        }));
    }
}

window.appState = new AppState();

window.debugAppState = {
    getAllSpots: () => window.appState.getAllSpots(),
    getAllGuides: () => window.appState.getAllGuides(),
    getSpot: (id) => window.appState.getSpot(id),
    getGuide: (id) => window.appState.getGuide(id),
    getPlanItems: () => window.appState.getPlanItems(),
    spotData: () => window.appState.spotData,
    guideData: () => window.appState.guideData
};
