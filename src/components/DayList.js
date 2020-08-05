import React from "react";
import DayListItem from './DayListItem';



export default function DayList(props) {

const daysArray = props.days.map(day => {
  return <DayListItem 
        name={day.name} 
        spots={day.spots} 
        selected={day.name === props.day}
        setDay={props.setDay} 
        key={day.id} />
})

   return (
   <ul>{daysArray}</ul>
   );
}
