import groceryImage from 'assets/images/banner/grocery.png';

export const sitePages = {
  [process.env.NEXT_PUBLIC_STG_CLIENT_ID]: {
    page_title: 'Store - STG',
    page_description: 'Grocery Details',
    banner_title_id: 'groceriesTitle',
    banner_description_id: 'groceriesSubTitle',
    banner_image_url: groceryImage,
  },
};
