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

const inventory = {
  id: 'group-inventory',
  title: <FormattedMessage id="Inventory" />,
  icon: icons.AppstoreAddOutlined,
  type: 'group',
  children: [
    {
      id: 'drugs',
      title: <FormattedMessage id="Drugs" />,
      type: 'collapse',
      icon: icons.AppstoreAddOutlined,
      children: [
        {
          id: 'drug-list',
          title: <FormattedMessage id="OPD Drugs" />,
          type: 'item',
          url: '/drug/drug-list'
        }
      ]
    },
    {
      id: 'labs',
      title: <FormattedMessage id="Lab Tests" />,
      type: 'collapse',
      icon: icons.AppstoreAddOutlined,
      children: [
        {
          id: 'lab-test-a',
          title: <FormattedMessage id="Laboratory A" />,
          type: 'item',
          url: '/labtest/lab-a'
        },
        {
          id: 'lab-test-b',
          title: <FormattedMessage id="Laboratory B" />,
          type: 'item',
          url: '/labtest/lab-b'
        },
        {
          id: 'lab-test-c',
          title: <FormattedMessage id="Laboratory C" />,
          type: 'item',
          url: '/labtest/lab-c'
        }
      ]
    }
  ]
};

export default inventory;
