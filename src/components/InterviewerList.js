import React from "react";
import InterviewerListItem from './InterviewerListItem';
import './InterviewerList.scss';


export default function InterviewerList(props) {
const interviewersArray = props.interviewers.map(interviewer => {
  return <InterviewerListItem 
        name={interviewer.name}
        id={interviewer.id}
        avatar={interviewer.avatar}
        selected={props.interviewer === interviewer.id ? true : false}
        setInterviewer={props.setInterviewer}
        key={interviewer.id} />
})

   return (
    <section className="interviewers">
    <h4 className="interviewers__header text--light">Interviewers</h4>
    <ul className="interviewers__list">{interviewersArray}</ul>
  </section>
   );
}
