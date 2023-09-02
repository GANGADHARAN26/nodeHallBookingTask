const express=require('express');
const app = express();
const bodyParser = require('body-parser');

//bodyParser.
app.use(bodyParser.json());



//local variables for Rooms,Booking and Customers

let rooms=[{
        roomId:1,
        noOfSeats:5,
        amentities:["wasking Machine", "Air Conditioner","Heater"],
        pricePerHour:1000,
    
    }];
let booking=[
    {
        customers:"Ramesh",
        bookingId:1,
        date:"01/09/2023",
        startTime:"01.0am",
        endTime:"12.00pm",
        roomId:1,
        bookedOn:"01/09/2023",
        status:"booked",
    }
];
let customers=[{
    name:"Ramesh",
    booking:[{
        roomId:1,
        noOfSeats:5,
        amentities:["wasking Machine", "Air Conditioner","Heater"],
        pricePerHour:1000,
        booked:false}
             ]}
];


//Endpoint to view all rooms 
app.get("/rooms/view",(req,res)=>{
     res.send(rooms);
     console.log(`All Rooms: ${rooms}`)
})
//Endpoint to create a new room
app.post("/rooms/create",(req,res)=>{
    rooms.push(req.body);
    res.send(rooms);
    console.log(`created room : ${res.body}`)
})

//Endpoint to view all booked rooms
app.get("/rooms/booked",(req,res)=>{
    res.send(booking);
    console.log(`Booked Rooms: ${rooms}`)
})

//Endpoint to view all customers data
app.get("/rooms/customers",(req,res)=>{
    res.send(customers);;
    console.log(`Customers Data: ${customers}`)
});

//Endpoint to view how many times a customer has booked room
app.get("/rooms/customer/:name",(req,res)=>{
    const {name}=req.params;
    const customer=customers.find(e=>e.name===name);
    if(!customer){res.status(404).send(`${name} is never exist in the data`)}
    const customerBooking=customer.booking;
    const BookingNumber=customer.booking.length;
    res.status(200).json({customer:customerBooking,NumberOfBooking:BookingNumber})
    console.log("name: " + name)
})


//Endpoint to book the room
app.post("/rooms/booking/:no",(req,res) => {
   try{
    const {no}=req.params;
    const { customer, date, startTime, endTime } = req.body; 
    
    //chencking the room is exist are not
    const room = rooms.find(e => e.roomId == no);
    if (!room) {
        return res.status(404).json({ message: "Room not found" });
    }
    
    //function to check only timing
    function isTimeSync(startTimeOne,endTimeOne,startTimeTwo,endTimeTwo){
        ///first i have tranferes into array
        let array = [startTimeOne,endTimeOne,startTimeTwo,endTimeTwo]
        //this array will store 24 hours format
        let RailwayTime=[];
        //this loop convert the hour:minute:am Or pm into 24 hour formate
        for(let i=0; i<array.length;i++){
            let splitTime=array.split("")
            let joinTime=splitTime[0]+splitTime[1]+splitTime[2]+splitTime[3];
            let clockZone=splitTime[5]+splitTime[6];
            if(clockZone=="pm")
            {
                joinTime=joinTime+12
            }else{
                joinTime=joinTime;
            }
            RailwayTime.push(joinTime);
        }
        //checking the time condition and return true if doesnt sync are alse it will return false
        if(RailwayTime[0]>RailwayTime[2]&&RailwayTime[1]<RailwayTime[3]||
            RailwayTime[0]==RailwayTime[2]&&RailwayTime[1]==RailwayTime[3]){
                return false;
            }
            else
            {
                return true;
            }
    }
    
    //chencking the room is already booked are not
    
    const roombooking=booking.filter(
        r => r.roomId ==no &&
         r.date==date && 
         isTimeSync(startTime,endTime,r.startTime,r.endTime));
          // Create a new booking
   
    if(!roombooking) 
    {
        return res.status(400).json({message:"Room is not available your reservation time"});
    }
    const newBooking = {
        customer,
        bookingId: bookings.length + 1,
        date,
        startTime,
        endTime,
        roomId: room.roomId,
        bookedOn: new Date().toLocaleDateString(),
        available: true,
    };
    booking.push(newBooking);
    res.status(201).json({message:"Room is booked",booking:newBooking});
    // if(roombooking.status=="booked"){return res.status(404).json({message:"Room is already booked"})}
   }
   catch(error)
   {
    res.status(400).json({message:"error booking room", error: error, data:bookings});
   }
})
//port
app.listen(5000,()=>console.log("port is listening on 5000"))