


const { createApp } = Vue;

createApp({
    data() {
        return {
            games: [],
            genres: [],
            gameName: '',
            longDesc: '',
            shortDesc: '',
            minimumReq: '',
            recommendedReq: '',
            headerImage: '',
            website: '',
            background: '',
            rawBackground: '',
            price: 0,
            discount: 0,
            stock: 0,
            screenshots: [],
            screenshot1: '',
            screenshot2: '',
            trailer1: '',
            trailer2: '',
            trailers: [],
            checkedGenres: [],
            categories: [],
            selectedGame: 0,
            quantity: 0,
            genreName: '',
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            axios.get('http://localhost:8080/api/products')
                .then(response => {
                    this.games = response.data
                    console.log(this.games)
                })
                .catch(err => console.log(err))

            axios.get('http://localhost:8080/api/genres')
                .then(response => {
                    console.log(response.data)
                    this.genres = response.data;
                })
                .catch(err => console.log(err))
        },
        addProduct() {

            if (!this.gameName || !this.longDesc || !this.shortDesc || !this.minimumReq || !this.recommendedReq || !this.headerImage || !this.website || !this.background || !this.rawBackground ||
                !this.screenshot1 || !this.screenshot2 || !this.trailer1 || !this.trailer2 || !this.checkedGenres.length) {
                Swal.fire('Please fill in all inputs', ':C', 'error')
            } else if (this.price <= 0 || this.stock <= 0) {
                Swal.fire('Price and stock cannot be less or equal to cero', ':C', 'error')
            } else if (this.discount > 2 || this.discount < 0) {
                Swal.fire('Discount value must be between 0 and 2', ':C', 'error')
            } else {

                this.screenshots.push(this.screenshot1)
                this.screenshots.push(this.screenshot2)

                this.trailers.push(this.trailer1)
                this.trailers.push(this.trailer2)

                axios.post('http://localhost:8080/api/products/new', {
                    desc: this.longDesc,
                    desc_short: this.shortDesc,
                    minimumReq: this.minimumReq,
                    recommendedReq: this.recommendedReq,
                    gameName: this.gameName,
                    imageHeader: this.headerImage,
                    website: this.website,
                    background: this.background,
                    rawBackground: this.rawBackground,
                    price: parseFloat(this.price),
                    discount: parseFloat(this.discount),
                    stock: parseInt(this.stock),
                    screenshots: this.screenshots,
                    trailers: this.trailers,
                    genres: this.checkedGenres,
                    categories: this.categories
                })
                    .then(response => console.log(response))
                    .catch(err => console.log(err))
            }


        },
        removeUnits() {
            let game = this.games.filter(game => game.id == this.selectedGame)
            if(this.quantity >= game[0].stock) {
                Swal.fire('Cannot remove units because the product has less stock than what you chose', ':C', 'error')
            } else if(this.quantity < 1) {
                Swal.fire('Please choose a possitive amount', ':C', 'error')
            } else {
                this.quantity = this.quantity*(-1)
                axios.patch(`http://localhost:8080/api/products/add/${this.selectedGame}`, `amount=${this.quantity}`)
                .then(res => {
                    Swal.fire('Units removed successfully', ':D', 'success')
                    this.loadData()
                })
                .catch(err => console.log(err))
            }
        },
        addUnits() {
            if(this.quantity < 1) {
                Swal.fire('Units must be greater or equal to one', ':C', 'error')
            } else {
                axios.patch(`http://localhost:8080/api/products/add/${this.selectedGame}`, `amount=${this.quantity}`)
                .then(res => {
                    Swal.fire('Added units successfully', ':D', 'success')
                    this.loadData()
                })
                .catch(err => console.log(err))
            }
        },
        showModal(id) {
            this.selectedGame = id;
            console.log(id)
        },
        logout() {
            axios.get('/api/logout')
        },
        addGenre() {
            if(!this.genreName) {
                Swal.fire('Genre name cannot be empty', ':C', 'error')
            } else {
                axios.post('http://localhost:8080/api/products/genre', `genreName=${this.genreName}`)
                .then(response => {
                    Swal.fire('Added succesfully', ':D', 'success')
                    this.loadData()
                })
                .catch(err => console.log(err))
            }
        },
        createAdmin() {
            if(!this.firstName || !this.lastName || !this.email || !this.password) {
                Swal.fire('Please fill in all inputs', ':C', 'error')
            } else {
                axios.post('http://localhost:8080/api/create-admin', `firstName=${this.firstName}&lastName=${this.lastName}
                &email=${this.email}&password=${this.password}`)
                .then(res => Swal.fire('Admin succesfully created', ':D', 'success'))
                .catch(err => console.log(err))
            }
        }


    }
}).mount('#app')