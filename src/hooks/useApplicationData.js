import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook for holding application data logic
export function useApplicationData() {

  // States for day, days list, appointments, and interviewers
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // Create websocket connection to allow multiple clients to have appointments update in realtime
  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    // Send initial ping message to ensure connection with scheduler-api server
    webSocket.onopen = function() {
      webSocket.send('ping');
    };

    // Listen on WS for new interview or deleted interview
    // then update appointment and days states accordingly
    webSocket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.type === 'SET_INTERVIEW') {
        // Update spots remaining to subtract one when new interview is booked
        setState(state => {
          const daysCopy = [];
          for (let i of state.days) {
            daysCopy.push(i);
            if (i.name === state.day) {
              daysCopy[daysCopy.indexOf(i)].spots -= 1;
            }
          }
          // Update appointments state when new interview is booked
          const appointment = {
            ...state.appointments[data.id],
            interview: data.interview
          };
          const appointments = {
            ...state.appointments,
            [data.id]: appointment
          };
          return {...state, appointments, days: daysCopy};
        });

        if (data.type === 'SET_INTERVIEW' && data.interview === null) {
        // Update spots remaining to add one when interview is cancelled
          setState(state => {
            const daysCopy = [];
            for (let i of state.days) {
              daysCopy.push(i);
              if (i.name === state.day) {
                daysCopy[daysCopy.indexOf(i)].spots += 2;
              }
            }
            // Update appointments state when interview is cancelled
            const appointment = {
              ...state.appointments[data.id],
              interview: data.interview
            };
            const appointments = {
              ...state.appointments,
              [data.id]: appointment
            };
            return {...state, appointments, days: daysCopy};
          });
        }
      }
    };
    return () => {
      webSocket.close();
    }
  },[]);

  // Save setDay function to update day state
  const setDay = day => setState({ ...state, day });

  // Function to book an interview with axios call to scheduler-api and local state update
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, {interview} )
    .then((res) => {
      return setState({...state, appointments});
    })
  };

  // Function to edit an interview with axios call to scheduler-api and local state update
  function editInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, {interview} )
    .then((res) => {
      return setState({...state, appointments});
    })
  };

  // Function to cancel an interview with axios call to scheduler-api and local state update
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`/api/appointments/${id}`, {appointment} )
    .then((res) => {
      return setState(state => {
        return {...state, appointments};
      });
    })
  };

  // Initial axios call to scheduler-api server to get data and save to state
  useEffect(() => {
    const promiseOne = axios.get('/api/days');
    const promiseTwo = axios.get('/api/appointments');
    const promiseThree = axios.get('/api/interviewers');

    Promise.all([promiseOne, promiseTwo, promiseThree])
    .then((arrayOfValues) => {
      let [daysData, apptData, interviewersData] = arrayOfValues;
      setState((prev) => {
        return ({...prev, days: daysData.data,
        appointments: apptData.data,
        interviewers: interviewersData.data
        })
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }, []);

  // Export the states and functions to be used from this custom hook
  return {
    state,
    setDay,
    bookInterview,
    editInterview,
    cancelInterview
  };
}

export default useApplicationData;