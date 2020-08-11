import React from "react";
import InterviewerListItem from './InterviewerListItem';
import './InterviewerList.scss';
import PropTypes from "prop-types";


export default function InterviewerList(props) {

  InterviewerList.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired
  };

    const interviewersArray = props.interviewers.map(interviewer => {
      return (  
                <InterviewerListItem
                key={interviewer.id}
                name={interviewer.name}
                id={interviewer.id}
                avatar={interviewer.avatar}
                selected={props.value === interviewer.id}
                onChange={props.onChange}>
                </ InterviewerListItem>
            );
        })

   return (
    <section className="interviewers">
    <h4 className="interviewers__header text--light">Interviewers</h4>
    <ul className="interviewers__list">{interviewersArray}</ul>
  </section>
   );
}
