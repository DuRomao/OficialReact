// dashbaord
import Default from "../Pages/Dashboard/Default";

//user
import UsersCardssContain from "../Pages/Users/UsersCards";
import UsersEditContain from "../Pages/Users/UsersEdit";

export const routes = [
  {
    path: `${process.env.PUBLIC_URL}/dashboard/default/:layout`,
    Component: <Default />,
  },
  {
    path: `${process.env.PUBLIC_URL}/app/users/edit/:layout`,
    Component: <UsersEditContain />,
  },
  {
    path: `${process.env.PUBLIC_URL}/app/users/cards/:layout`,
    Component: <UsersCardssContain />,
  },
];
