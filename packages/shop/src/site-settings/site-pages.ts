import groceryImage from 'assets/images/banner/grocery.png';
import bakeryImage from 'assets/images/banner/bakery.jpg';

export const sitePages = {
  [process.env.NEXT_PUBLIC_STG_CLIENT_ID]: {
    page_title: 'Store - STG',
    page_description: 'Grocery Details',
    banner_title_id: 'groceriesTitle',
    banner_description_id: 'groceriesSubTitle',
    banner_image_url: groceryImage,
  },
  bakery: {
    page_title: 'Bakery - PickBazar',
    page_description: 'Bakery Details',
    banner_title_id: 'bakeryTitle',
    banner_description_id: 'bakerySubTitle',
    banner_image_url: bakeryImage,
  },
};
