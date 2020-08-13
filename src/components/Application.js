import React from "react";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from '../helpers/selectors';
import "components/Application.scss";
import useApplicationData from '../hooks/useApplicationData';

// Application component to display the whole app
export default function Application(props) {

  // Import application data from the custom hook useApplicationData
  const {
    state,
    setDay,
    bookInterview,
    editInterview,
    cancelInterview
  } = useApplicationData();

  // Format interviewers into an array with the helpers/selector function getInterviewersForDay
  // used as props for appointments
  let interviewersArray = getInterviewersForDay(state, state.day);

  // Format appointments data with the helpers/selector function getAppointmentsForDay
  // then map to array which displays each appointment as an Appointment component
  // displayed as the list of appointments when rendered
  const displayAppts = getAppointmentsForDay(state, state.day).map((appt) => {
    return (
      <article className="appointment" data-testid="appointment" key={appt.id}>
        <Appointment 
        key={appt.id}
        {...appt}
        interview={getInterview(state, appt.interview)} 
        interviewers={interviewersArray} 
        bookInterview={bookInterview} 
        editInterview={editInterview}
        cancelInterview={cancelInterview} 
        />
      </article>
    )
  })

  // Render the application with the daylist and appointments for the selected day
  return (
    <main className="layout">
      <section className="sidebar"> 
        <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state['days']} day={state['day']} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {displayAppts}
      </section>
    </main>
  );
}
