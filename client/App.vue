<template>
 <div id="app">
   <h1>{{ msg }}</h1>
   <div class="row" id="eventList">
       <h2>Event List</h2>
       <table v-if="hasEvents">
           <thead>
               <tr>
                   <th>Start</th>
                   <th>End</th>
                   <th>Title</th>
                   <th>Description</th>
                   <th></th>
               </tr>
           </thead>
           <tbody>
               <tr v-for="event in events" :key="event.id">
                   <td>{{ event.startDate }} {{ event.startTime }}</td>
                   <td>{{ event.endDate }} {{ event.endTime }}</td>
                   <td>{{ event.title }}</td>
                   <td>{{ event.description }}</td>
                   <td>
                       <button id="eventDelete" @click="confirmDeleteEvent(event.id)" class="btn-small"><i class="material-icons right">delete</i>Delete</button>
                   </td>
               </tr>
           </tbody>
       </table>
       <p v-if="noEvents">No events yet!</p>
   </div>
   <div class="row" id="eventEdit">
       <h2>Add an Event</h2>
       <form class="col s12" @submit.prevent="addEvent">
           <div class="row">
               <div class="input-field col s6">
                   <span class="datetime-label">Start Date</span>
                   <datetime v-model="startDate" input-id="startDate" type="date" value-zone="local" input-class="validate"></datetime>
                   <!-- <label for="startDate" class="datetime-label">Start Date</label> -->
               </div>
               <div class="input-field col s6">
                   <span class="datetime-label">Time</span>
                   <datetime v-model="startTime" input-id="startTime" type="time" minute-step="5" use12-hour="true" value-zone="local" input-class="validate"></datetime>
                   <!-- <label for="startTime" class="datetime-label">Time</label> -->
               </div>
           </div>
           <div class="row">
               <div class="input-field col s6">
                   <span class="datetime-label">End Date</span>
                   <datetime v-model="endDate" input-id="endDate" type="date" value-zone="local" input-class="validate"></datetime>
                   <!-- <label for="endDate">End Date</label> -->
               </div>
               <div class="input-field col s6">
                   <span class="datetime-label">Time</span>
                   <datetime v-model="endTime" input-id="endTime" type="time" minute-step="5" use12-hour="true" value-zone="local" input-class="validate"></datetime>
                   <!-- <input v-model="endTime" ref="endTime" placeholder="" id="endTime" type="text" class="validate"> -->
                   <!-- <label for="endTime">Time</label> -->
               </div>
           </div>
           <div class="row">
               <div class="input-field col s12">
                   <input v-model="title" ref="title" placeholder="Appointment" id="title" type="text" class="validate">
                   <label for="title">Title</label>
               </div>
           </div>
           <div class="row">
               <div class="input-field col s12">
                   <input v-model="description" ref="description" placeholder="Description" id="description" type="text" class="validate">
                   <label for="description">Description</label>
               </div>
           </div>
           <button id="eventEditSubmit" class="btn" type="submit"><i class="material-icons right">send</i>Submit</button>
       </form>
   </div>
   <div id="deleteConfirm" ref="deleteConfirm" class="modal">
       <div class="modal-content">
           <h2>Confirm delete</h2>
           <p>Delete {{ selectedEvent }}?</p>
       </div>
       <div class="modal-footer">
           <button @click="deleteEvent(selectedEventId)" class="modal-close btn-flat">Ok</button>
           <button class="modal-close btn-flat">Cancel</button>
       </div>
   </div>
 </div>
</template>

<script>
import axios from "axios";
import * as M from "materialize-css";
import moment from "moment";

export default {
 name: "app",
 computed: {
   hasEvents() {
     return this.isLoading === false && this.events.length > 0;
   },
   noEvents() {
     return this.isLoading === false && this.events.length === 0;
   }
 },
 data() {
   return {
     title: "",
     description: "",
     events: [],
     isLoading: true,
     startDate: "",
     startTime: "",
     endDate: "",
     endTime: "",
     selectedEvent: "",
     selectedEventId: 0
   };
 },
 methods: {
   addEvent() {
     const event = {
       startDate: this.startDate ? moment( this.startDate ).format( "YYYY-MM-DD" ) : null,
       startTime: this.startTime ? moment( this.startTime ).format( "YYYY-MM-DD HH:mm:00" ) : null,
       endDate: this.endDate ? moment( this.endDate ).format( "YYYY-MM-DD" ) : null,
       endTime: this.endTime ? moment( this.endTime ).format( "YYYY-MM-DD HH:mm:00" ) : null,
       title: this.title,
       description: this.description
     };
     axios
       .post( "/api/events", event )
       .then( () => {
         this.startDate = "";
         this.startTime = "";
         this.endDate = "";
         this.endTime = "";
         this.title = "";
         this.description = "";
         this.loadEvents();
       } )
       .catch( err => {
         this.msg = err.message;
         console.log( err );
       } );
   },
   confirmDeleteEvent( id ) {
     const event = this.events.find( e => e.id === id );
     this.selectedEvent = `'${ event.title }' on ${ event.startDate }${ event.startTime ? ` at ${ event.startTime }` : "" }`;
     this.selectedEventId = event.id;
     const dc = this.$refs.deleteConfirm;
     const modal = M.Modal.init( dc );
     modal.open();
   },
   deleteEvent( id ) {
     axios
       .delete( `/api/events/${ id }` )
       .then( this.loadEvents )
       .catch( err => {
         this.msg = err.message;
         console.log( err );
         this.loadEvents();
       } );
   },
   formatDate( d ) {
     return d ? moment.utc( d ).format( "MMM D, YYYY" ) : "";
   },
   formatTime( t ) {
     return t ? moment( t ).format( "h:mm a" ) : "";
   },
   formatEvents( events ) {
     return events.map( event => {
       return {
         id: event.id,
         title: event.title,
         description: event.description,
         startDate: this.formatDate( event.startDate ),
         startTime: this.formatTime( event.startTime ),
         endDate: this.formatDate( event.endDate ),
         endTime: this.formatTime( event.endTime )
       };
     } );
   },
   loadEvents() {
     axios
       .get( "/api/events" )
       .then( res => {
         this.isLoading = false;
         this.events = this.formatEvents( res.data );
       } )
       .catch( err => {
         this.msg = err.message;
         console.log( err );
       } );
   }
 },
 mounted() {
   return this.loadEvents();
 }
};
</script>

<style lang="css">
#app h2 {
 font-size: 2rem;
}
.datetime-label {
 color: #9e9e9e;
 font-size: .8rem;
}
</style>