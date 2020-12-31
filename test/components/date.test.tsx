import React from "react";
import {render} from "@testing-library/react";
import Date from "../../components/date";

it("Date component should return formatted date", async () => {
  const {getByText} = render(<Date dateString="20000101"/>);
  expect(getByText("January 1, 2000")).toBeVisible();
})
