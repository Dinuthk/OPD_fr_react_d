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

const finance = {
  id: 'group-finance',
  title: <FormattedMessage id="Finance" />,
  icon: icons.AppstoreAddOutlined,
  type: 'group',
  children: [
    {
      id: 'payment-list',
      title: <FormattedMessage id="Payments" />,
      type: 'collapse',
      icon: icons.AppstoreAddOutlined,
      children: [
        {
          id: 'opd',
          title: <FormattedMessage id="OPD Payments" />,
          type: 'item',
          url: '/payment/opd'
        }
      ]
    }
  ]
};

export default finance;
