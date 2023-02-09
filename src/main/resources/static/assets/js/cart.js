


const { createApp } = Vue

const app = createApp({
    data() {
        return {
            gamesStorage: [],
            genreGame: undefined,
            gamesBackup: [],
            objectPurchase: [],
            totalPayment: 0,
            cvvCard: undefined,
            amount: undefined,
            numberCard: '',
            isLoggedIn: false
        }
    },
    created() {
        this.isLogged()
        this.loadGames()
    },
    methods: {
        loadGames() {
            if (typeof localStorage === 'undefined' || !localStorage) return;
        
            if (localStorage.getItem("game")) {
                this.gamesStorage = JSON.parse(localStorage.getItem("game"))
                if (this.gamesStorage) {
                    this.gamesStorage.map(prop => prop.stockGame = 1)
                    this.objectPurchase = this.gamesStorage.map(prop => {
                        return {
                            productId: prop.id,
                            productQuantity: prop.stockGame
                        }
                    })
                }
            }
        }
        ,
        deleteGame(id) {
            Swal.fire({
                title: 'Are you sure that want to remove that game?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#0057b9',
                cancelButtonColor: '#9b0000',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.gamesStorage = this.gamesStorage.filter(prop => prop.id !== id)
                    localStorage.removeItem(this.gamesStorage)
                    localStorage.setItem("game", JSON.stringify(this.gamesStorage))
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                }
            })
        },
        stockQuantity(operation, game) {
            if (operation == 1) {
                if (game.stock > game.stockGame) {
                    game.stockGame++
                }
            } else {
                if (!game.stockGame < 1) {
                    game.stockGame--
                }
            }
        },
        formatMoney(amount) {
            let aux = amount
            let USDollar = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            return USDollar.format(aux)
        },
        payment() {
            axios.post('http://localhost:8081/api/receive-payment', `cardNumber=${this.numberCard}&cvv=${this.cvvCard}&amount=${this.totalPayment}&description=semfil gaming purchase`)
                .then(() => {
                    axios.post('/api/purchase', {
                        accepted: true,
                        listProductPurchase: this.objectPurchase
                    })
                    .then(res => {
                        Swal.fire('Purchase succesfull', 'The ticket has been sent to your email', 'success')
                    })
                    .catch(err => Swal.fire('There was an error processing your payment', 'Sorry, try again', 'error'))
                })
                .catch(err => Swal.fire('Not enough money on account', 'Try another payment method', 'error'))
        },
        login() {
            location.href = '../../login.html'
        },
        logout() {
            axios('/api/logout')
            .then(res => {
                localStorage.setItem('isLoggedIn', JSON.stringify(false))
                location.href = '../../login.html'
            })
            .catch(err => console.log(err))
        },
        isLogged() {
            console.log('activo')
            axios('/api/clients/current')
            .then(res => {
                console.log('true')
                this.isLoggedIn = true
            })
            .catch(err => isLoggedIn = false)
        }
    },
    computed: {
        totalPay() {
            if (this.gamesStorage.length > 0) {
                this.totalPayment = this.gamesStorage.map(prop => prop.totalAmount = prop.price * prop.stockGame).reduce((acc, ite) => acc += ite)
            } else {
                this.totalPayment = 0
            }
        }
        
    }
})
app.mount("#app")



function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}