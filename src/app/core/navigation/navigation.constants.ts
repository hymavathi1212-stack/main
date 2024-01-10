import { FuseNavigationItem } from "@fuse/components/navigation";
import { Navigation } from "./navigation.types";

let defaultNavigation: FuseNavigationItem[];

const settingsNavigationItem: FuseNavigationItem = {
    "id": "settings",
    "title": "Settings",
    "type": "basic",
    "icon": "heroicons_outline:cog",
    "link": "/settings"
}

const adminNavigation: FuseNavigationItem[] = [
    {
        "id": "dashboard",
        "title": "Dashboard",
        "type": "basic",
        "icon": "heroicons_outline:table",
        "link": "/admin/dashboard"
    },
    {
        "id": "users",
        "title": "Users",
        "type": "collapsable",
        "icon": "heroicons_outline:users",
        children: [
            {
                id   : 'users.list',
                title: 'List',
                type : 'basic',
                icon : 'mat_outline:list',
                link : '/admin/users/list'
            }
        ]
    },
    {
        "id": "products",
        "title": "Products",
        "type": "collapsable",
        "icon": "mat_outline:shopping_cart",
        children: [
            {
                id   : 'products.list',
                title: 'List',
                type : 'basic',
                icon : 'mat_outline:list',
                link : '/admin/products/list'
            },
            {
                id   : 'products.add',
                title: 'Add New',
                type : 'basic',
                icon : 'mat_outline:add',
                link : '/admin/products/create'
            },
            {
                id   : 'products.conversions',
                title: 'Conversions',
                type : 'basic',
                icon : 'mat_outline:login',
                link : '/admin/products/conversions'
            }
        ]
    },
    {
        "id": "payments",
        "title": "Payments",
        "type": "collapsable",
        "icon": "mat_outline:payment",
        children: [
            {
                id   : 'payments.list',
                title: 'List',
                type : 'basic',
                icon : 'mat_outline:list',
                link : '/admin/payments/list'
            }
        ]
    },
    settingsNavigationItem
];
const affliaterNavigation: FuseNavigationItem[] = [
    {
        "id": "dashboard",
        "title": "Dashboard",
        "type": "basic",
        "icon": "heroicons_outline:chart-pie",
        "link": "/affliater/dashboard"
    },
    {
        "id": "affliate-profile",
        "title": "Profile",
        "type": "basic",
        "icon": "heroicons_outline:user",
        "link": "/affliater/profile"
    },
];
const verifiedAffliaterNavigation: FuseNavigationItem[] = [
    ...affliaterNavigation,
    {
        "id": "analytics",
        "title": "Analytics",
        "type": "basic",
        "icon": "heroicons_outline:chart-bar",
        "link": "/affliater/analytics"
    },
    {
        "id": "transactions",
        "title": "Transactions",
        "type": "basic",
        "icon": "heroicons_outline:cash",
        "link": "/affliater/transactions"
    },
    settingsNavigationItem
];
const studentNavigation: FuseNavigationItem[] = [
    {
        "id": "dashboard",
        "title": "Dashboard",
        "type": "basic",
        "icon": "heroicons_outline:chart-pie",
        "link": "/student/dashboard"
    },
    {
        "id": "student-profile",
        "title": "Profile",
        "type": "basic",
        "icon": "heroicons_outline:user",
        "link": "/student/profile"
    },
    {
        "id": "learning-calendar",
        "title": "Learning Calendar",
        "type": "basic",
        "icon": "heroicons_outline:user",
        "link": "/student/learningcalendar"
    },
];
const verifiedStudentNavigation: FuseNavigationItem[] = [
    ...studentNavigation,
    {
        "id": "analytics",
        "title": "Analytics",
        "type": "basic",
        "icon": "heroicons_outline:chart-bar",
        "link": "/student/analytics"
    },
    {
        "id": "transactions",
        "title": "Transactions",
        "type": "basic",
        "icon": "heroicons_outline:cash",
        "link": "/student/transactions"
    },
    settingsNavigationItem
];
affliaterNavigation.push(settingsNavigationItem);

export const navigationItems = (type): Navigation => {
    // defaultNavigation = type === 'admin' ? adminNavigation : ((type === 'verifiedAffiliater') ? verifiedAffliaterNavigation : affliaterNavigation);
    let defaultNavigation;
    switch(type){
        case 'admin':
            defaultNavigation= adminNavigation
        break;
        case 'verifiedAffiliater':
            defaultNavigation= verifiedAffliaterNavigation
        break;
        case 'affiliater':
            defaultNavigation= affliaterNavigation
        break;
        case 'student':
            defaultNavigation= studentNavigation
        break;
        case 'verifiedStudent':
            defaultNavigation= verifiedStudentNavigation
        break;
    }

    return {
        "compact": defaultNavigation,
        "default": defaultNavigation,
        "futuristic": defaultNavigation,
        "horizontal": defaultNavigation
    }
};
