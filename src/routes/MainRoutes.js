import { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import { element } from 'prop-types';
import DoctorListPage from 'pages/doctors/doctor-list';

// import LabTestTracking from 'pages/lab_test_tracking/lab-test-tracking-list';
// import OPD_default from 'pages/opd_dashbord/OPD_default';
//import DoctorListPage from 'pages/doctors/doctor-list';

const OPD_DefaultPage = Loadable(lazy(() => import('pages/opd_dashbord/OPD_default')));
const LabTestTracking = Loadable(lazy(() => import('pages/lab_test_tracking/lab-test-tracking-list')));
const AppUserList = Loadable(lazy(() => import('pages/users/user-list')));
const AppPatientList = Loadable(lazy(() => import('pages/patients/patient-list')));
const DrugList = Loadable(lazy(() => import('pages/opd_drugs/opd_drugs-list')));

const PaymentListPage = Loadable(lazy(()=> import('pages/opd_finance/opd_payment-list')));
const LabtestPageA = Loadable(lazy(()=>import('pages/opd_labtests/opd_labtests-listA')));
const LabtestPageB = Loadable(lazy(()=>import('pages/opd_labtests/opd_labtests-listB')));
const LabtestPageC = Loadable(lazy(()=>import('pages/opd_labtests/opd_labtests-listC')));





const AppInvoiceDashboard = Loadable(lazy(() => import('pages/dashboard/analytics')));

// pages routing
const AuthLogin = Loadable(lazy(() => import('pages/auth/login')));
const AuthRegister = Loadable(lazy(() => import('pages/auth/register')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/forgot-password')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/reset-password')));
const AuthCheckMail = Loadable(lazy(() => import('pages/auth/check-mail')));
const AuthCodeVerification = Loadable(lazy(() => import('pages/auth/code-verification')));

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));

const AppContactUS = Loadable(lazy(() => import('pages/contact-us')));

const OPD_kanban = Loadable(lazy(() => import('pages/opd_dashbord/OPD_kanban')));



// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'dashboard',
          children: [
            {
              path: 'default',
              //element: <AppInvoiceDashboard/>
              element: <OPD_kanban/>
            },
            {
              path: 'analytics',
              element: <OPD_DefaultPage/>
            }
          ]
        },
        {
          path: 'user',
          children: [
            {
              path: 'user-list',
              element: <AppUserList />
            },
            {
              path: 'patient-list',
              element: <AppPatientList />
            },
            {
              path: 'doctor-list',
              element: <DoctorListPage />
            },
            {
              path: 'lab-test-tracking',
              element: <LabTestTracking />
            }

            // {
            //   path: 'role-list',
            //   element: <AppRoleList />
            // },
          ]
        },
        {
          path: 'drug',
          children: [
            {
              path: 'drug-list',
              element: <DrugList />
            }
          ]
        },
        {
          path: 'labtest',
          children: [
            {
              path: 'lab-a',
              element: <LabtestPageA />
            }, {
              path: 'lab-b',
              element: <LabtestPageB />
            }, {
              path: 'lab-c',
              element: <LabtestPageC />
            }
          ]
        },
        {
          path: 'doctor',
          children: [
            {
              path: 'doctor-list',
              element: <DrugList />
            }
          ]
        },
        {
          path: 'payment',
          children: [
            {
              path: 'opd',
              element: <PaymentListPage/>
            }
          ]
        }
      ]
    },
    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    },
    {
      path: '/auth',
      element: <CommonLayout />,
      children: [
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'register',
          element: <AuthRegister />
        },
        {
          path: 'forgot-password',
          element: <AuthForgotPassword />
        },
        {
          path: 'reset-password',
          element: <AuthResetPassword />
        },
        {
          path: 'check-mail',
          element: <AuthCheckMail />
        },
        {
          path: 'code-verification',
          element: <AuthCodeVerification />
        }
      ]
    },
    {
      path: '/',
      element: <CommonLayout layout="simple" />,
      children: [
        {
          path: 'contact-us',
          element: <AppContactUS />
        }
      ]
    }
  ]
};

export default MainRoutes;
