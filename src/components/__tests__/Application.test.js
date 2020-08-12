import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, queryByPlaceholderText, queryAllByTestId, queryByText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe('Application', () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"))
    fireEvent.click(getByText('Tuesday'));
    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change((queryByPlaceholderText(appointment, /Enter Student Name/i)),{ target: { value: 'Lydia Miller-Jones' } });
    fireEvent.click(queryAllByTestId(appointment, 'interviewer-face')[0]);
    fireEvent.click(getByText(appointment, 'Save'));
    // debug()
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();
  
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    expect(getByText(appointment, 'Lydia Miller-Jones')).toBeInTheDocument();

    const mon = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(mon, /no spots remaining/i)).toBeInTheDocument();
  });

});