import { environment } from "environments/environment";

const prefix = environment.apiUrl;
const endPoints = {
    fetch_affiliate_profile: '/AffiliateProfile/me',
    fetch_affiliate_products: '/AffiliateProducts/getActiveProducts',
    fetch_affiliate_products_with_filter: '/AffiliateProducts/getProductsList',
    fetch_product_tracking_list: '/affiliatetrackusersinfo/list',
    fetch_profile_types: '/ProfileTypes/activeList',
    manage_profile_type_action: '/affiliateprofiletypes/manageaffiliatetype',
    manage_profile_approval: '/AffiliateProfile/manageProfileApproval',
    products_list: '/affiliateproducts/list',
    conversions_list: '/affiliatetrackusersinfo/conversionslist',
    save_product: '/AffiliateProducts/create',
    update_product: '/AffiliateProducts/update',
    manage_product: '/AffiliateProducts/manage',
    admin_stats: '/users/adminStats',
    get_conversion_details: '/affiliateconversionspayment/getconversionpaymentdetails',
    get_conversion_details_by_id: '/affiliateconversionspayment/getconversionpaymentdetailsbyid',
    search_user: '/affiliateproductusercommission/searchuser',
    get_user_commission_list: '/affiliateproductusercommission/getlist',
    update_user_commission_details: '/affiliateproductusercommission/updatecommissiondetails',
    remove_user_commission: '/affiliateproductusercommission/removeUserCommission',
    update_profile_type_wise_commission: '/AffiliateProductCommission/update',
    users_list: '/users/list',
    logout: '/users/logout',
    user_dashboard: '/users/dashboard',
    get_short_url: '/AffiliateProductShortUrls/getShortUrl', 
    save_profile: '/AffiliateProfile/update',
    login: `/users/login`,
    register: '/users/register',
    affliater_profile: '/affiliateProfile',
    verify_account: '/EmailVerification/verify',
    forgot_password: '/users/forgot',
    reset_password: '/users/resetPassword',
    change_password: '/users/changePassword',
    transactions_list: '/AffiliateConversionsPayment/getListByAffiliate',
    admin_transactions_list: '/AffiliateConversionsPayment/list'
}
export const getEndPoint = (type) => {
    return prefix+endPoints[type];
}
 