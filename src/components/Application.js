import React from "react";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from '../helpers/selectors';
import "components/Application.scss";
import useApplicationData from '../hooks/useApplicationData';


export default function Application(props) {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  let interviewersArray = getInterviewersForDay(state, state.day);

  const displayAppts = getAppointmentsForDay(state, state.day).map((appt) => {
    return (
      <Appointment 
      key={appt.id}
      {...appt}
      interview={getInterview(state, appt.interview)} 
      interviewers={interviewersArray} 
      bookInterview={bookInterview} 
      cancelInterview={cancelInterview} 
      />
    )
  })

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
