// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FilterOutlined,
  UsergroupDeleteOutlined,
  SettingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  FilterOutlined,
  UsergroupDeleteOutlined,
  SettingOutlined
};
// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.AppstoreAddOutlined,
  type: 'group',
  children: [
    {
      id: 'users',
      title: <FormattedMessage id="Settings" />,
      type: 'collapse',
      icon: icons.SettingOutlined,
      children: [
        {
          id: 'user-list',
          title: <FormattedMessage id="Users" />,
          type: 'item',
          url: '/user/user-list'
        },
        {
          id: 'patient-list',
          title: <FormattedMessage id="Patients" />,
          type: 'item',
          url: '/user/patient-list'
        },
        {
          id: 'doctor-list',
          title: <FormattedMessage id="Doctors" />,
          type: 'item',
          url: '/user/doctor-list'
        },
        {
          id: 'lab-test-list',
          title: <FormattedMessage id="Lab Test Tracking" />,
          type: 'item',
          url: '/user/lab-test-tracking'
        },
        // {
        //   id: 'role-list',
        //   title: <FormattedMessage id="User Permissions" />,
        //   type: 'item',
        //   url: '/user/user-list'
        // }
      ]
    }
  ]
};

export default applications;
