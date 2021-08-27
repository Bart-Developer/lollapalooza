 /* @AUTOWIRED VUE 3.X*/

 const app = Vue.createApp({

     data() {
         return {
             cardHolder: "",
             /* viaja al bank*/
             cardNumber: "",
             /* viaja al bank*/
             thruDate: "",
             /* viaja al bank*/
             cvv: 0,
             /* viaja al bank*/
             articleName: "gorrita",
             /* viaja al bank*/
             articlePrice: 500,
             /* viaja al bank*/
             fromPage: "https://www.lollapaloozaar.com/",
             /* viaja al bank*/
             publicCards: {},
             /* viaja al bank*/
             cardDetected: [],
             /* viaja al bank*/
             repositorioLocal: JSON.parse(sessionStorage.getItem("SESSIONSTATUS")) == null ? [] : JSON.parse(sessionStorage.getItem("SESSIONSTATUS")),
             productsArray: [],
             nameEvent: [],
             cantEvent: [],
             cantProductsArray: [],
             fees: 1,
             idF: "",
         }
     },

     created() {

         this.productsArray = this.repositorioLocal.map(x => x.name);
         this.productsArray = this.productsArray.filter(x => x != "Day1" && "Day2" && "Day3" && "Day3" && "Day4" && "Day5");
         console.log(this.productsArray);

         this.cantProductsArray = this.repositorioLocal.map(x => x.count)
         this.cantProductsArray = this.cantProductsArray.filter(x => x != undefined);
         console.log(this.cantProductsArray);


         this.cantEvent = this.repositorioLocal.filter(x => x.countMerch);
         console.log(this.cantEvent)


         axios.get("https://stark-escarpment-65840.herokuapp.com/api/infoCards").then(({ data }) => { this.publicCards = data;
                 console.log(data) })
             .catch(() => console.log("we try connect to the data base"));
         axios.get()
     },

     methods: {
         sendBuy() {

             /*  axios.post('http://localhost:8080/api/newPurchase', `cardHolder=${this.cardHolder}&thruDate=${this.thruDate.replace("/", "-")}&number=${this.cardNumber}&cvv=${this.cvv}&fees=${this.fees}&nameArticle=${this.articleName}&amount=${this.articlePrice}&fromPage=${this.fromPage}`)
              .then( () => {  */
             axios.post('/api/clients/current/newfactura', `nameArticle=${this.productsArray}&cantArticle=${this.cantProductsArray}&nameEvent=${this.nameEvent}&cantEvent=${this.cantEvent}`)
                 .then(res => {
                     this.idF = res.data;
                     Swal.fire({
                         icon: 'success',
                         title: 'your purchase was successful',
                         showClass: {
                             popup: 'animate__animated animate__fadeInDown'
                         },
                         hideClass: {
                             popup: 'animate__animated animate__fadeOutUp'
                         }
                     })
                     axios.post("/api/clients/current/export/pdf", "numberFactura=" + this.idF, { responseType: 'blob' })

                     .then((response) => {
                             const url = window.URL.createObjectURL(new Blob([response.data]));
                             const link = document.createElement('a');
                             link.href = url;
                             link.setAttribute('download', 'Lollapalooza N° ' + this.idF + '.pdf');
                             document.body.appendChild(link);
                             link.click();
                             sessionStorage.clear();
                         })
                         .catch(err => {

                             console.log(err)
                         })
                         /*  }) */
                         .catch((res) => {
                             /* if (res.response.data == "Client not authenticado") {
                                 swal("You will be redirected to enter")
                                 window.location.href = "/login.html"
                             } */

                             Swal.fire({
                                 icon: 'error',
                                 title: 'Oops...',
                                 text: 'Something went wrong!',
                                 footer: `<strong>${res.response.data}</strong>`
                             })

                         })
                 })
                 .catch((res) => {

                     Swal.fire({
                         icon: 'error',
                         title: 'Oops...',
                         text: 'Something went wrong!',
                         footer: `<strong>${res.response.data}</strong>`
                     })
                 })
         },
     },
     computed: {
         name() {
             return this.data
         }
     },

     computed: {
         detectCard() {
             if (this.cardNumber.length == 19) {
                 [this.cardDetected] = this.publicCards.filter(x => x.cardNumber == this.cardNumber)
             }
         }
     },

 })

 app.mount("#app")