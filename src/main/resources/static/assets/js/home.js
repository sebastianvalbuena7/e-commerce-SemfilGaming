const { createApp } = Vue

const app = createApp({
    data() {
        return {
            games: [],
            gamesAleatory: [],
            fourGames: []
        }
    },
    created() {
        this.chargeGames()
    },
    methods: {
        chargeGames() {
            axios.get('/api/products')
                .then(response => {
                    this.games = response.data
                    this.gamesAleatory = this.games.sort(() => Math.random() - 0.5)
                    this.fourGames = this.gamesAleatory.splice(0, 4)
                })
                .catch(error => console.log(error))
        },
        modalDescription(game) {
            const genreDTO = game.genreDTOS
            let aux = genreDTO.map(game => game.genre.genreName).join(" - ")
            Swal.fire({
                background: `${game.background}`,
                customClass: {
                    confirmButton: 'swalBtnColor',
                    popup: 'my-swal'
                },
                html: `
                    <div class="div-card">
                        <div>
                            <h2 class="text-light fw-bold text-center mb-0">${game.gameName}</h2>
                            <div class="d-flex justify-content-center">
                                <video class="rounded mt-3 video-card" src="${game.trailers}" width="800" controls height="600"></video>
                            </div>
                        </div>
                        <div class="d-flex mx-auto flex-column align-items-center justify-content-center">
                        <p class="text-light mt-4">${game.desc}</p>
                        <div class="d-flex px-2 gap-1 flex-wrap">
                            <div class="text-light">
                                ${game.minimumReq}
                            </div>
    
                            <div class="text-light">
                                ${game.recommendedReq}
                            </div>
                        </div>
                        <div>
                            <p class="mt-4 text-light fw-bold">Genre: ${aux}</p>
                        </div>
                        </div>
                    </div>
                    `,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            })
        },
        login() {
			axios.post("/api/login", `email=${this.email}&password=${this.password}`)
				.then(() => {
					localStorage.setItem('isLoggedIn', JSON.stringify(true))
					location.href = '../../store.html'
				})
				.catch(error => console.log(error))
		},
        formatMoney(amount){
            let aux = amount
            let USDollar = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            return USDollar.format(aux)
        },
        redirect() {
            location.href = '../../store.html'
        }
    }
})

app.mount("#content")





































function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}