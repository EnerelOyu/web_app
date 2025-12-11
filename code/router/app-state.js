// Global application state management
class AppState {
    constructor() {
        // Plan data - маршрутын мэдээлэл
        this.planItems = this.loadPlanFromStorage();

        // Currently selected spot
        this.currentSpot = null;

        // Spot data repository (will be loaded from JSON)
        this.spotData = {};

        // Guide data repository (will be loaded from JSON)
        this.guideData = {};

        // Load data from JSON files
        this.loadSpotData();
        this.loadGuideData();

        // Temporary spot data (backup for compatibility)
        this.tempSpotData = {
            'amarbayasgalant': {
                id: 'amarbayasgalant',
                title: 'АМАРБАЯСГАЛАНТ ХИЙД',
                rating: '4.3',
                cate: 'Түүхэн, Соёл',
                status: 'Нээлттэй',
                time: '9:00AM–6:00 PM',
                img1: 'https://lp-cms-production.imgix.net/2023-07/shutterstockRF567790018.jpg',
                img2: 'https://lp-cms-production.imgix.net/2023-07/shutterstockRF567790018.jpg',
                img3: 'https://lp-cms-production.imgix.net/2023-07/shutterstockRF567790018.jpg',
                region: 'Төв',
                location: 'Сэлэнгэ аймгийн Бүрэнхаан уулын өвөрт Ивэн голын эхэнд байрлана.',
                age: '18-45',
                price: 'Үнэгүй',
                schedule: 'Дав: 8:00AM - 18:00PM, Мяг: 8:00AM - 18:00PM, Лха: 8:00AM - 18:00PM, Пүр: 8:00AM - 18:00PM, Баа: 8:00AM - 18:00PM, Бям: 8:00AM - 18:00PM, Ням: 8:00AM - 18:00PM',
                description: 'Энэ бол тухайн газрын дэлгэрэнгүй тайлбар. Анхаарах зүйлс, цагийн хуваарь, үнэ зэргийг оруулна.'
            },
            'gandan': {
                id: 'gandan',
                title: 'ГАНДАН ТЭГЧИНЛЭН ХИЙД',
                rating: '4.5',
                cate: 'Түүхэн, Соёл',
                status: 'Нээлттэй',
                time: '8:00AM–7:00 PM',
                img1: 'https://lp-cms-production.imgix.net/2019-06/73598f88ed537774c53235a248ac9feb-gandan-khiid.jpg',
                img2: 'https://lp-cms-production.imgix.net/2019-06/73598f88ed537774c53235a248ac9feb-gandan-khiid.jpg',
                img3: 'https://lp-cms-production.imgix.net/2019-06/73598f88ed537774c53235a248ac9feb-gandan-khiid.jpg',
                region: 'Төв',
                location: 'Улаанбаатар хотын төв хэсэгт байрлана.',
                age: 'Бүх нас',
                price: '50,000 MNT',
                schedule: 'Дав: 8:00AM - 19:00PM, Мяг: 8:00AM - 19:00PM, Лха: 8:00AM - 19:00PM, Пүр: 8:00AM - 19:00PM, Баа: 8:00AM - 19:00PM, Бям: 8:00AM - 19:00PM, Ням: 8:00AM - 19:00PM',
                description: 'Монголын хамгийн том буддын сүм.'
            },
            'khustai': {
                id: 'khustai',
                title: 'ХУСТАЙН БАЙГАЛИЙН ЦОГЦОЛБОР',
                rating: '4.5',
                cate: 'Байгаль, Амралт',
                status: 'Нээлттэй',
                time: '6:00AM–8:00 PM',
                img1: 'https://lp-cms-production.imgix.net/2023-08/iStock-1218362078.jpg',
                img2: 'https://lp-cms-production.imgix.net/2023-08/iStock-1218362078.jpg',
                img3: 'https://lp-cms-production.imgix.net/2023-08/iStock-1218362078.jpg',
                region: 'Төв',
                location: 'Төв аймгийн Алтанбулаг сумд байрлана.',
                age: 'Бүх нас',
                price: '500,000 MNT',
                schedule: 'Дав: 6:00AM - 20:00PM, Мяг: 6:00AM - 20:00PM, Лха: 6:00AM - 20:00PM, Пүр: 6:00AM - 20:00PM, Баа: 6:00AM - 20:00PM, Бям: 6:00AM - 20:00PM, Ням: 6:00AM - 20:00PM',
                description: 'Тахь морийг хадгалж буй байгалийн цогцолбор газар.'
            },
            'sukhbaatar': {
                id: 'sukhbaatar',
                title: 'СҮХБААТАРЫН ТАЛБАЙ',
                rating: '4.0',
                cate: 'Түүхэн, Соёл',
                status: 'Нээлттэй',
                time: '24/7',
                img1: 'https://lp-cms-production.imgix.net/2019-06/870d8d6123525e17e6a4c9d34b14f8c7-chinggis-khaan-sukhbaatar-square.jpg',
                img2: 'https://lp-cms-production.imgix.net/2019-06/870d8d6123525e17e6a4c9d34b14f8c7-chinggis-khaan-sukhbaatar-square.jpg',
                img3: 'https://lp-cms-production.imgix.net/2019-06/870d8d6123525e17e6a4c9d34b14f8c7-chinggis-khaan-sukhbaatar-square.jpg',
                region: 'Төв',
                location: 'Улаанбаатар хотын төв талбай.',
                age: 'Бүх нас',
                price: 'Үнэгүй',
                schedule: 'Дав: 24/7, Мяг: 24/7, Лха: 24/7, Пүр: 24/7, Баа: 24/7, Бям: 24/7, Ням: 24/7',
                description: 'Улаанбаатар хотын гол талбай.'
            },
            'tsonjin': {
                id: 'tsonjin',
                title: 'ЦОНЖИН БОЛДОГ',
                rating: '4.5',
                cate: 'Соёл, Байгаль',
                status: 'Нээлттэй',
                time: '8:00AM–6:00 PM',
                img1: 'https://lp-cms-production.imgix.net/2023-07/shutterstockRF1229637994.jpg',
                img2: 'https://lp-cms-production.imgix.net/2023-07/shutterstockRF1229637994.jpg',
                img3: 'https://lp-cms-production.imgix.net/2023-07/shutterstockRF1229637994.jpg',
                region: 'Төв',
                location: 'Төв аймагт байрлана.',
                age: 'Бүх нас',
                price: '20,000 MNT',
                schedule: 'Дав: 8:00AM - 18:00PM, Мяг: 8:00AM - 18:00PM, Лха: 8:00AM - 18:00PM, Пүр: 8:00AM - 18:00PM, Баа: 8:00AM - 18:00PM, Бям: 8:00AM - 18:00PM, Ням: 8:00AM - 18:00PM',
                description: 'Морин аялал, амьтантай ойр харилцах боломжтой.'
            },
            'altai': {
                id: 'altai',
                title: 'АЛТАЙ ТАВАН БОГД',
                rating: '4.5',
                cate: 'Байгаль, Амралт сувилал',
                status: 'Нээлттэй',
                time: '24/7',
                img1: 'https://montsame.mn/files/667399f904664.jpeg',
                img2: 'https://montsame.mn/files/667399f904664.jpeg',
                img3: 'https://montsame.mn/files/667399f904664.jpeg',
                region: 'Алтай',
                location: 'Баян-Өлгий аймагт байрлана.',
                age: 'Бүх нас',
                price: '100,000 MNT',
                schedule: 'Дав: 24/7, Мяг: 24/7, Лха: 24/7, Пүр: 24/7, Баа: 24/7, Бям: 24/7, Ням: 24/7',
                description: 'Монголын хамгийн өндөр оргил бүхий уулархаг газар.'
            },
            'erdenezuu': {
                id: 'erdenezuu',
                title: 'ЭРДЭНЭ ЗУУ ХИЙД',
                rating: '4.4',
                cate: 'Түүхэн, Соёл',
                status: 'Нээлттэй',
                time: '8:00AM–6:00 PM',
                img1: 'https://lp-cms-production.imgix.net/2023-07/shutterstockRF579068047.jpg',
                img2: 'https://lp-cms-production.imgix.net/2023-07/shutterstockRF579068047.jpg',
                img3: 'https://lp-cms-production.imgix.net/2023-07/shutterstockRF579068047.jpg',
                region: 'Хангай',
                location: 'Өвөрхангай аймагт байрлана.',
                age: 'Бүх нас',
                price: '15,000 MNT',
                schedule: 'Дав: 8:00AM - 18:00PM, Мяг: 8:00AM - 18:00PM, Лха: 8:00AM - 18:00PM, Пүр: 8:00AM - 18:00PM, Баа: 8:00AM - 18:00PM, Бям: 8:00AM - 18:00PM, Ням: 8:00AM - 18:00PM',
                description: 'Монголын анхны буддын сүм хийд.'
            },
            'aglag': {
                id: 'aglag',
                title: 'АГЛАГ БҮТЭЭЛИЙН ХИЙД',
                rating: '4.2',
                cate: 'Түүхэн, Соёл',
                status: 'Нээлттэй',
                time: '9:00AM–5:00 PM',
                img1: 'https://lp-cms-production.imgix.net/2023-08/shutterstock668674942.jpg',
                img2: 'https://lp-cms-production.imgix.net/2023-08/shutterstock668674942.jpg',
                img3: 'https://lp-cms-production.imgix.net/2023-08/shutterstock668674942.jpg',
                region: 'Төв',
                location: 'Төв аймагт байрлана.',
                age: 'Бүх нас',
                price: 'Үнэгүй',
                schedule: 'Дав: 9:00AM - 17:00PM, Мяг: 9:00AM - 17:00PM, Лха: 9:00AM - 17:00PM, Пүр: 9:00AM - 17:00PM, Баа: 9:00AM - 17:00PM, Бям: 9:00AM - 17:00PM, Ням: Амардаг',
                description: 'Төгс занабазарын бүтээлүүдтэй түүхэн хийд.'
            },
            'shankh': {
                id: 'shankh',
                title: 'ШАНХЫН ХИЙД',
                rating: '4.3',
                cate: 'Түүхэн, Соёл',
                status: 'Нээлттэй',
                time: '9:00AM–6:00 PM',
                img1: 'https://lp-cms-production.imgix.net/2023-08/iStock-1218476559.jpg',
                img2: 'https://lp-cms-production.imgix.net/2023-08/iStock-1218476559.jpg',
                img3: 'https://lp-cms-production.imgix.net/2023-08/iStock-1218476559.jpg',
                region: 'Хангай',
                location: 'Өвөрхангай аймагт байрлана.',
                age: 'Бүх нас',
                price: '10,000 MNT',
                schedule: 'Дав: 9:00AM - 18:00PM, Мяг: 9:00AM - 18:00PM, Лха: 9:00AM - 18:00PM, Пүр: 9:00AM - 18:00PM, Баа: 9:00AM - 18:00PM, Бям: 9:00AM - 18:00PM, Ням: 9:00AM - 18:00PM',
                description: 'Далай Ламтай холбоотой түүхэн хийд.'
            },
            'bogdkhan': {
                id: 'bogdkhan',
                title: 'БОГД ХААНЫ ОРДОН МУЗЕЙ',
                rating: '4.6',
                cate: 'Түүхэн, Соёл',
                status: 'Нээлттэй',
                time: '10:00AM–5:00 PM',
                img1: 'https://lp-cms-production.imgix.net/2023-07/shutterstock743550031.jpg',
                img2: 'https://lp-cms-production.imgix.net/2023-07/shutterstock743550031.jpg',
                img3: 'https://lp-cms-production.imgix.net/2023-07/shutterstock743550031.jpg',
                region: 'Төв',
                location: 'Улаанбаатар хотод байрлана.',
                age: 'Бүх нас',
                price: '8,000 MNT',
                schedule: 'Дав: 10:00AM - 17:00PM, Мяг: 10:00AM - 17:00PM, Лха: 10:00AM - 17:00PM, Пүр: 10:00AM - 17:00PM, Баа: 10:00AM - 17:00PM, Бям: Амардаг, Ням: Амардаг',
                description: 'Монголын сүүлчийн хааны ордон.'
            },
            'terkhiin': {
                id: 'terkhiin',
                title: 'ТЭРХИЙН ЦАГААН НУУР',
                rating: '4.7',
                cate: 'Байгаль, Амралт',
                status: 'Нээлттэй',
                time: '24/7',
                img1: 'https://lp-cms-production.imgix.net/2023-05/iStock-178959041.jpg',
                img2: 'https://lp-cms-production.imgix.net/2023-05/iStock-178959041.jpg',
                img3: 'https://lp-cms-production.imgix.net/2023-05/iStock-178959041.jpg',
                region: 'Хангай',
                location: 'Архангай аймагт байрлана.',
                age: 'Бүх нас',
                price: 'Үнэгүй',
                schedule: 'Дав: 24/7, Мяг: 24/7, Лха: 24/7, Пүр: 24/7, Баа: 24/7, Бям: 24/7, Ням: 24/7',
                description: 'Галт уулын үйл ажиллагааны үр дүнд үүссэн үзэсгэлэнт нуур.'
            },
            'ganga': {
                id: 'ganga',
                title: 'ГАНГА НУУР',
                rating: '4.5',
                cate: 'Байгаль, Амралт',
                status: 'Нээлттэй',
                time: '24/7',
                img1: 'https://resource4.sodonsolution.org/24tsag/image/2023/04/11/lsjspaux9r6jwurn/%D0%9D%D2%AF%D2%AF%D0%B4%D0%BB%D0%B8%D0%B9%D0%BD%20%D1%88%D1%83%D0%B2%D1%83%D1%83%D0%B4%20%D0%B8%D1%80%D0%BB%D1%8D%D1%8D.jpg',
                img2: 'https://resource4.sodonsolution.org/24tsag/image/2023/04/11/lsjspaux9r6jwurn/%D0%9D%D2%AF%D2%AF%D0%B4%D0%BB%D0%B8%D0%B9%D0%BD%20%D1%88%D1%83%D0%B2%D1%83%D1%83%D0%B4%20%D0%B8%D1%80%D0%BB%D1%8D%D1%8D.jpg',
                img3: 'https://resource4.sodonsolution.org/24tsag/image/2023/04/11/lsjspaux9r6jwurn/%D0%9D%D2%AF%D2%AF%D0%B4%D0%BB%D0%B8%D0%B9%D0%BD%20%D1%88%D1%83%D0%B2%D1%83%D1%83%D0%B4%20%D0%B8%D1%80%D0%BB%D1%8D%D1%8D.jpg',
                region: 'Зүүн',
                location: 'Дорнод аймагт байрлана.',
                age: 'Бүх нас',
                price: 'Үнэгүй',
                schedule: 'Дав: 24/7, Мяг: 24/7, Лха: 24/7, Пүр: 24/7, Баа: 24/7, Бям: 24/7, Ням: 24/7',
                description: 'Монголын хамгийн том цэнгэг усны нуур.'
            }
        };
    }

    // Load spot data from JSON file
    async loadSpotData() {
        try {
            const response = await fetch('../json/spots.json');
            const data = await response.json();

            // ID mapping for compatibility with existing code
            const idMapping = {
                'Цонжин Болдог': 'tsonjin',
                'Амарбаясгалант хийд': 'amarbayasgalant',
                'Хустайн байгалийн цогцолборт газар': 'khustai',
                'Горхи-Тэрэлж Үндэсний Парк': 'terelj',
                'Гандан Тэгчинлэн Хийд': 'gandan',
                'Богд хан уул': 'bogdkhan',
                'Хөвсгөл нуур': 'khovsgol',
                'Эрдэнэзуу хийд': 'erdenezuu',
                'Тэрхийн цагаан нуур': 'terkhiin',
                'Алтай Таван богд': 'altai',
                'Алтай Таван Богд': 'altai',
                'Сүхбаатарын талбай': 'sukhbaatar',
                'Аглаг бүтээлийн хийд': 'aglag',
                'Шанхын хийд': 'shankh',
                'Ганга нуур': 'ganga',
                'Монгол Элс': 'mongolels',
                'Мөнххайрхан уул': 'munkhkhairkhan'
            };

            // Transform JSON data to match existing structure
            data.spots.forEach(spot => {
                const id = idMapping[spot.name] || this.generateSpotId(spot.name);
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
                    activities: spot.activities.join(', ')
                };
            });

            // Merge with temporary data (for compatibility)
            this.spotData = { ...this.tempSpotData, ...this.spotData };

            this.dispatchStateChange('spotData', this.spotData);
        } catch (error) {
            console.error('Error loading spot data:', error);
            // Use temporary data as fallback
            this.spotData = this.tempSpotData;
        }
    }

    // Load guide data from JSON file
    async loadGuideData() {
        try {
            const response = await fetch('../json/guides.json');
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
                    profileImg: guide.profileImgUrl
                };
            });

            this.dispatchStateChange('guideData', this.guideData);
        } catch (error) {
            console.error('Error loading guide data:', error);
        }
    }

    // Generate spot ID from name
    generateSpotId(name) {
        // Remove special characters and convert to lowercase
        return name
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[ө]/g, 'o')
            .replace(/[ү]/g, 'u')
            .replace(/[а]/g, 'a')
            .replace(/[б]/g, 'b')
            .replace(/[в]/g, 'v')
            .replace(/[г]/g, 'g')
            .replace(/[д]/g, 'd')
            .replace(/[е]/g, 'e')
            .replace(/[ё]/g, 'yo')
            .replace(/[ж]/g, 'j')
            .replace(/[з]/g, 'z')
            .replace(/[и]/g, 'i')
            .replace(/[й]/g, 'i')
            .replace(/[к]/g, 'k')
            .replace(/[л]/g, 'l')
            .replace(/[м]/g, 'm')
            .replace(/[н]/g, 'n')
            .replace(/[о]/g, 'o')
            .replace(/[п]/g, 'p')
            .replace(/[р]/g, 'r')
            .replace(/[с]/g, 's')
            .replace(/[т]/g, 't')
            .replace(/[у]/g, 'u')
            .replace(/[ф]/g, 'f')
            .replace(/[х]/g, 'h')
            .replace(/[ц]/g, 'ts')
            .replace(/[ч]/g, 'ch')
            .replace(/[ш]/g, 'sh')
            .replace(/[щ]/g, 'sh')
            .replace(/[ъ]/g, '')
            .replace(/[ы]/g, 'i')
            .replace(/[ь]/g, '')
            .replace(/[э]/g, 'e')
            .replace(/[ю]/g, 'yu')
            .replace(/[я]/g, 'ya')
            .substring(0, 20); // Limit length
    }

    // Get spot by ID
    getSpot(spotId) {
        return this.spotData[spotId];
    }

    // Get all spots
    getAllSpots() {
        return Object.values(this.spotData);
    }

    // Get guide by ID
    getGuide(guideId) {
        return this.guideData[guideId];
    }

    // Get all guides
    getAllGuides() {
        return Object.values(this.guideData);
    }

    // Set current spot
    setCurrentSpot(spotId) {
        this.currentSpot = this.spotData[spotId];
        this.dispatchStateChange('currentSpot', this.currentSpot);
    }

    // Load plan items from localStorage
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

    // Save plan items to localStorage
    savePlanToStorage() {
        try {
            localStorage.setItem('ayalgo-planItems', JSON.stringify(this.planItems));
        } catch (error) {
            console.error('Error saving plan to storage:', error);
        }
    }

    // Add spot to plan
    addToPlan(spotId) {
        const spot = this.getSpot(spotId);
        if (!spot) return false;

        // Check if already exists
        const exists = this.planItems.some(item => item.id === spotId);
        if (exists) {
            alert('Энэ газар аль хэдийн төлөвлөгөөнд байна!');
            return false;
        }

        this.planItems.push({
            id: spotId,
            number: this.planItems.length + 1,
            ...spot
        });

        this.savePlanToStorage();
        this.dispatchStateChange('planItems', this.planItems);
        return true;
    }

    // Remove from plan
    removeFromPlan(spotId) {
        const index = this.planItems.findIndex(item => item.id === spotId);
        if (index > -1) {
            this.planItems.splice(index, 1);
            // Renumber items
            this.planItems.forEach((item, idx) => {
                item.number = idx + 1;
            });
            this.savePlanToStorage();
            this.dispatchStateChange('planItems', this.planItems);
        }
    }

    // Clear all plan items
    clearPlan() {
        this.planItems = [];
        this.savePlanToStorage();
        this.dispatchStateChange('planItems', this.planItems);
    }

    // Get all plan items
    getPlanItems() {
        return this.planItems;
    }

    // Dispatch state change event
    dispatchStateChange(key, value) {
        window.dispatchEvent(new CustomEvent('appstatechange', {
            detail: { key, value }
        }));
    }
}

// Create global instance
window.appState = new AppState();

// Debug utility - доступно через console
window.debugAppState = {
    getAllSpots: () => window.appState.getAllSpots(),
    getAllGuides: () => window.appState.getAllGuides(),
    getSpot: (id) => window.appState.getSpot(id),
    getGuide: (id) => window.appState.getGuide(id),
    getPlanItems: () => window.appState.getPlanItems(),
    spotData: () => window.appState.spotData,
    guideData: () => window.appState.guideData
};
