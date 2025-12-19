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

    }

    // Load spot data from JSON file
    async loadSpotData() {
        try {
            const response = await fetch('http://localhost:3000/api/spots');
            const data = await response.json();

            // Transform JSON data to match existing structure
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

            // Merge with temporary data (JSON data takes priority)
            this.spotData = { ...this.spotData };

            console.log('Spot data ачаалагдлаа:', Object.keys(this.spotData).length, 'газар');
            console.log('Бүс нутгууд:', [...new Set(Object.values(this.spotData).map(s => s.region))].sort());

            this.dispatchStateChange('spotData', this.spotData);
        } catch (error) {
            console.error('Error loading spot data:', error);
            // Use temporary data as fallback
            this.spotData = this.tempSpotData;
        }
    }

    // Load guide data from API
    async loadGuideData() {
        try {
            const response = await fetch('http://localhost:3000/api/guides');
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
                    languages: guide.languages ? guide.languages.split(',').map(l => l.trim()) : [],
                    experience: guide.experienceLevel,
                    profileImg: guide.profileImgUrl || '../files/guide-img/default-profile.svg',
                };
            });

            console.log('Guide data ачаалагдлаа:', Object.keys(this.guideData).length, 'хөтөч');

            this.dispatchStateChange('guideData', this.guideData);
        } catch (error) {
            console.error('Error loading guide data:', error);
            // Fallback to JSON
            this.loadGuideDataFromJSON();
        }
    }

    async loadGuideDataFromJSON() {
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
                    profileImg: guide.profileImgUrl || '../files/guide-img/default-profile.svg',
                };
            });

            console.log('Guide data (JSON) ачаалагдлаа:', Object.keys(this.guideData).length, 'хөтөч');

            this.dispatchStateChange('guideData', this.guideData);
        } catch (error) {
            console.error('Error loading guide data from JSON:', error);
        }
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
            // Return 'exists' status to show different toast message
            return 'exists';
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
        // Convert spotId to string for comparison since getAttribute returns string
        const spotIdStr = String(spotId);
        const index = this.planItems.findIndex(item => String(item.id) === spotIdStr);

        if (index > -1) {
            this.planItems.splice(index, 1);
            // Renumber items
            this.planItems.forEach((item, idx) => {
                item.number = idx + 1;
            });
            this.savePlanToStorage();
            this.dispatchStateChange('planItems', this.planItems);
            return true;
        }
        return false;
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
