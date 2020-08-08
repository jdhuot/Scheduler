




export function getAppointmentsForDay(state, day) {
  let appts = [];
  for (let i of state.days)
  if (i.name === day) {
    for (let j of i.appointments) {
      appts.push(state.appointments[j])
    }
  }
  return appts;
}

export function getInterviewersForDay(state, day) {
  let interviewers = [];
  for (let i of state.days)
  if (i.name === day) {
    for (let j of i.interviewers) {
      interviewers.push(state.interviewers[j])
    }
  }
  return interviewers;
}

export function getInterview(state, interview) {
  if (interview === null) {
    return null;
  }
  if (typeof interview.interviewer === 'number' && interview.interviewer) {
    let interviewerId = interview.interviewer;
    let intName = "";
    let intAvatar = "";
    for (let i in state.appointments) {
      if (typeof state.appointments[i].interviewer !== 'number' && state.appointments[i].interviewer) {
        for (let j in state.appointments[i].interviewer) {
          if (state.appointments[i].interviewer[j].id === interviewerId) {
            intName = state.appointments[i].interviewer[j].name;
            intAvatar = state.appointments[i].interviewer[j].avatar;
          }
        }
      }
    }
   return {student: interview.student, interviewer: {id: interviewerId, name: intName, avatar: intAvatar}};
  } else if (interview.interviewer) {
    return interview;
  } else {
    return null;
  }
}


export default {getAppointmentsForDay, getInterview, getInterviewersForDay }