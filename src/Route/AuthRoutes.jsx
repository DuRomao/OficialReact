import ForgetPwd from '../Components/Pages/Auth/ForgetPwd';
import Maintenance from '../Components/Pages/Auth/Maintenance';
import ErrorPage1 from '../Components/Pages/ErrorPages/ErrorPage400';
import ErrorPage2 from '../Components/Pages/ErrorPages/ErrorPage401';
import ErrorPage3 from '../Components/Pages/ErrorPages/ErrorPage403';
import ErrorPage4 from '../Components/Pages/ErrorPages/ErrorPage404';
import Error500 from '../Components/Pages/ErrorPages/ErrorPage500';
import Error503 from '../Components/Pages/ErrorPages/ErrorPage503';

export const authRoutes = [
  { path: `${process.env.PUBLIC_URL}/pages/authentication/forget-pwd/:layout`, Component: <ForgetPwd /> },
  { path: `${process.env.PUBLIC_URL}/pages/authentication/maintenance/:layout`, Component: <Maintenance /> },

  //Error
  { path: `${process.env.PUBLIC_URL}/pages/errors/error400/:layout`, Component: <ErrorPage1 /> },
  { path: `${process.env.PUBLIC_URL}/pages/errors/error401/:layout`, Component: <ErrorPage2 /> },
  { path: `${process.env.PUBLIC_URL}/pages/errors/error403/:layout`, Component: <ErrorPage3 /> },
  { path: `${process.env.PUBLIC_URL}/pages/errors/error404/:layout`, Component: <ErrorPage4 /> },
  { path: `${process.env.PUBLIC_URL}/pages/errors/error500/:layout`, Component: <Error500 /> },
  { path: `${process.env.PUBLIC_URL}/pages/errors/error503/:layout`, Component: <Error503 /> },
];
