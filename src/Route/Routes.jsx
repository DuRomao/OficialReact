// dashbaord
import Default from "../Components/Dashboard/Default";

export const routes = [
  {
    path: `${process.env.PUBLIC_URL}/dashboard/default/:layout`,
    Component: <Default />,
  },
  
];
