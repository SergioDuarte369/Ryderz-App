const motor = new Vue({

  el: "#vue-motor",

  data: {
    actualMonth: "October",
    hideAndSeek: true,
    octoberRaces: [],
    novemberRaces: [],
    lastClicked: {
      piloto1: [],
      piloto2: [],
      imagenPiloto1: [],
      imagenPiloto2: [],
      circuito: [],
      fecha: [],
      mapa: [],
      webCircuito: [],
      nombreUsuarioChat: "",
      isLoaded : false,
      //uid = firebase.auth().currentUser.uid,    Sentencia para identificar al usuario de firebsae
    }


  },
  methods: {
    //Función para conseguir los datos de nuestro Json, para la creación de nuestros datos en nuestra aplicación
    
    
    getData() {
      //await the response of the fetch call
      let response = fetch(`https://api.myjson.com/bins/snbid`)
        .then(function (response) { ///En esta parte estamos obteniendo la respuesta del fetch
          return response.json();
        })
        .then(function (myJson) { //// En esta parte estamos dando a la funcion que tiene mis datos el nombre de (myJson) pero podemos darle el nombre que nos convenga
          let carreras = myJson.Races;
          this.isLoaded = true;
          motor.octoberRaces = carreras.filter(carrera => carrera.Month === "October");
          motor.novemberRaces = carreras.filter(carrera => carrera.Month === "November");
          
        })
    },



    // Función para cambiar el mes, Nos permite cambiar entre los eventos de los diferentes meses
    changeMonth() {
      if (motor.actualMonth === "October") {
        motor.actualMonth = "November";
      } else if (motor.actualMonth === "November") {
        motor.actualMonth = "October";
      }
    },



    // Función que nos permite identificarnos con Google en nustra aplicación
    logInWithGoogle() {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function (result) {
        motor.nombreUsuarioChat  =  result.user.displayName;
    });
      

    },


    //Función para mostrar los datos que descargamos de nuestro Json para mostrarlo en el calendario de los enfrentamientos
    dataClicked(race) {
      this.lastClicked.piloto1 = race.Rider_1
      this.lastClicked.piloto2 = race.Rider_2
      this.lastClicked.imagenPiloto1 = race.Rider_1_pic
      this.lastClicked.imagenPiloto2 = race.Rider_2_pic
      this.lastClicked.circuito = race.Circuit
      this.lastClicked.fecha = race.Date
      this.lastClicked.mapa = race.Google_maps_code
      this.lastClicked.webCircuito = race.Circuit_web_page
    },


    //Función para escribir mensajes en nuestra base de datos. (la primera parte  this.eliminarHijos() es para evitar la replica de los mensajes que ya tenemos en nuestra ventana de chat)
    pruebaEscribirMensaje() {
      this.eliminarHijos();
      
      let user = this.nombreUsuarioChat;
      let msg = document.getElementById("chat1Messages").value;



      let newKey = firebase.database().ref('chat/').push().key;
    
      let updates = {};
      updates['chat/' + newKey] = {
        message: msg,
        userName: user,
      }
      firebase.database().ref().update(updates);
      console.log(msg);
      
    },



// Leer mensajes de la base de datos en nuestro cuadro de chat//

    pruebaLeerMensaje() {
      firebase.database().ref('chat').on('value', function (data) {
        var mensajes = data.val();

        
for (mensaje  in mensajes) {
  document.getElementById("chatID").innerHTML +=     
  `<div class="d-flex justify-content-">           
  <div class="talk-bubble tri-right round">
    <div>
      <p class="pChat name">${mensajes[mensaje].userName}</p>
      <p class="pChat">${mensajes[mensaje].message}</p>
    </div>
  </div>
  </div>`


    console.log(mensajes[mensaje]);
    console.log(mensajes[mensaje].message);
    console.log(mensajes[mensaje].userName);
    /////Copia de plantilla para mensajes de chat      .replace(/\s\s+/g, ' ')
    /*  document.getElementById("chatID").innerHTML +=
  `<div class="d-flex justify-content-${position}">
  <div class="talk-bubble tri-right ${firstClass} round">
    <div class="${secondClass}">
      <p class="pChat name">${mensajes[mensaje].userName}</p>
      <p class="pChat">${mensajes[mensaje].message.replace(/\s\s+/g, ' ')}</p>
    </div>
  </div>
  </div>`
*/
}
        
      })
    },




    //Función para eliminar hijos de nuestro chat para que el chat se vacíe de mensajes antiguos antes de cargar y evitar la repetición de mensajes en nuestra pantalla de chat//
    eliminarHijos(){

      let kill = document.getElementById("chatID"); 
      kill.innerHTML = ""; 
   

    
  },
  resetMessage(){
 document.getElementById("chat1Messages").innerHTML = "Write a message"
  },


  //Función para enviar mensajes a nuestra base de datos//
  //NO SE USA//
    /*enviarMensajeBBDD(msgID) {
      this.db.ref(msgID).push({       
        message: this.messageText,
        user: this.currentUser.displayName,
        userID: this.currentUID
      });
      this.messageText = "";
    }, */



    //Plantilla para la creación de los mensajes para enviar a nuestra base de datos//
    //Actualmente en NO SE USA//

    /*chatTemplate(chatID, data, position, firstClass, secondClass) {
      document.getElementById(chatID).innerHTML +=
        `<div class="d-flex justify-content-${position}">
        <div class="talk-bubble tri-right ${firstClass} round">
          <div class="${secondClass}">
            <p class="pChat name">${data.val().user}</p>
            <p class="pChat">${(data.val().msg).replace(/\s\s+/g, ' ')}</p>
          </div>
        </div>
        </div>`;
    },*/




  },

  created() {
    this.getData();
    this.pruebaLeerMensaje();
    this.resetMessage();
  }

})