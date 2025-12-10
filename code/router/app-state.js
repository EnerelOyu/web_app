// Global application state management
class AppState {
    constructor() {
        // Plan data - маршрутын мэдээлэл
        this.planItems = [];

        // Currently selected spot
        this.currentSpot = null;

        // Spot data repository
        this.spotData = {
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
            }
        };
    }

    // Get spot by ID
    getSpot(spotId) {
        return this.spotData[spotId];
    }

    // Set current spot
    setCurrentSpot(spotId) {
        this.currentSpot = this.spotData[spotId];
        this.dispatchStateChange('currentSpot', this.currentSpot);
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
            this.dispatchStateChange('planItems', this.planItems);
        }
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
