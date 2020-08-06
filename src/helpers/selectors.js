


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


export default getAppointmentsForDay;