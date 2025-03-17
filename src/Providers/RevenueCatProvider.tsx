import React, {createContext, useContext, useEffect, useState} from "react";
import {Alert, Platform} from "react-native";
import Purchases, {CustomerInfo, LOG_LEVEL, PurchasesPackage} from "react-native-purchases";
import {paymentApi} from "../../api/ProfileCompletion/PostApis/paymentApi";
import {useSelector} from "react-redux";
import { boostNumberApi } from "api/ProfileCompletion/PutApis/boostNumber";

// API keys for RevenueCat
const APIKeys = {
    apple: 'appl_eKAKNyCWTWPSGnBKGRLizxWfxTu',
    google: 'goog_eNqnjQbmAtDAtQfQeBSBzXDWISK',
};

interface RevenueCatProps {
    purchasePackage: (pack: PurchasesPackage, token: string) => Promise<{state:number,message?:string}>;
    restorePermissions: () => Promise<CustomerInfo>;
    user: UserState;
    packages: PurchasesPackage[];
    boostPack: PurchasesPackage[];
    isReady: boolean;
}

export interface UserState {
    boost: number;
    pro: boolean;
}

const RevenueCatContext = createContext<RevenueCatProps | null>(null);

export const useRevenueCat = () => {
    return useContext(RevenueCatContext) as RevenueCatProps;
};

// Helper function to calculate the end date based on the identifier
const calculateEndDate = (identifier: string): string => {
    const today = new Date();
    let endDate = new Date();

    if (identifier.includes('1m')) {
        endDate.setMonth(today.getMonth() + 1); // 1 month
    } else if (identifier.includes('1w')) {
        endDate.setDate(today.getDate() + 7); // 1 week
    } else if (identifier.includes('3m')) {
        endDate.setMonth(today.getMonth() + 3); // 3 months
    }

    return endDate.toISOString().split("T")[0];
};

export const RevenueCatProvider = ({children}: any) => {
    const [user, setUser] = useState<UserState>({boost: 0, pro: false});
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [boostPack, setBoostPack] = useState<PurchasesPackage[]>([]);
    const [isReady, setIsReady] = useState(false);

    // Initialize RevenueCat SDK
    useEffect(() => {
        const init = async () => {
            try {
                if (Platform.OS === 'ios') {
                    await Purchases.configure({apiKey: APIKeys.apple});
                } else {
                    await Purchases.configure({apiKey: APIKeys.google});
                }

                Purchases.setLogLevel(LOG_LEVEL.DEBUG);
                setIsReady(true);

                loadOfferings();
                updateUserInfo();
            } catch (error) {
                console.error("Error initializing RevenueCat: ", error);
            }
        };

        init();
    }, []);

    // Load available offerings
    const loadOfferings = async () => {
        
        try {
            const offerings = await Purchases.getOfferings();
            console.log(offerings);
            const currentOffering = offerings?.current;
            const boostOffers = offerings?.all['boosts'];
            console.log(currentOffering?.availablePackages);
            if (currentOffering) {
                setBoostPack(boostOffers?.availablePackages);
                setPackages(currentOffering?.availablePackages);
            }
        } catch (error) {
            console.error("Error loading offerings: ", error);
        }
    };

    // Update user subscription info
    const updateUserInfo = async () => {
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            let boostCount = 0;
            let proStatus = false;

            if (customerInfo.activeSubscriptions.includes('rca_1m') || 
                customerInfo.activeSubscriptions.includes('rca_3m') || 
                customerInfo.activeSubscriptions.includes('rca_1w')) {
                proStatus = true;
            }

            if (customerInfo.entitlements.active['oneboost']) {
                boostCount += 1;
            }
            if (customerInfo.entitlements.active['fiveboosts']) {
                boostCount += 5;
            }
            if (customerInfo.entitlements.active['tenboosts']) {
                boostCount += 10;
            }

            setUser({boost: boostCount, pro: proStatus});
        } catch (error) {
            console.error("Error fetching user info: ", error);
        }
    };

    // Handle package purchase
    const purchasePackage = async (pack: PurchasesPackage, token: string):Promise<{state:number,message?:string}> => {
        const endDate = calculateEndDate(pack.product.identifier);
        try {
            const purchaseInfo = await Purchases.purchasePackage(pack);
            if (pack.product.productCategory === "SUBSCRIPTION") {
                // Premium plan purchase
                // console.log('I am from the hook',purchaseInfo);
                try {
                    const data = await paymentApi({
                        user: token,
                        type: pack.product.title,
                        description: pack.product.description,
                        amount: pack.product.price,
                        endTime: endDate,
                    });
                    console.log("Payment API response:", data);
                } catch (e) {
                    console.error('Error in payment API:', e);
                }

            } else if (pack.product.productCategory === "CONSUMABLE") {
                // return {message:data,state:1}
                // Boost purchase
                const boostCount = pack.product.identifier === "oneboost" ? 1 
                                : pack.product.identifier === "fiveboosts" ? 5 
                                : pack.product.identifier === "tenboosts" ? 10 
                                : 0;

                try {
                    const data = await boostNumberApi({
                        user: token,
                        boosts: boostCount,
                    });
                    console.log("Boost API response:", data);
                } catch (e) {
                    console.error('Error in boost API:', e);
                }
            }

            updateUserInfo();

            return {state:1}

        } catch (error: any) {
            console.error("Purchase failed:", error);
            if (!error.userCancelled) {
                return {state:0,message:error.message}
            }
            return {state:0,message:error.message}
        }
    };

    // Restore previous purchases
    const restorePermissions = async (): Promise<CustomerInfo> => {
        try {
            const customerInfo = await Purchases.restorePurchases();
            updateUserInfo();
            return customerInfo;
        } catch (error) {
            console.error("Error restoring purchases: ", error);
            throw error;
        }
    };

    return (
        <RevenueCatContext.Provider
            value={{
                purchasePackage,
                restorePermissions,
                user,
                packages,
                boostPack,
                isReady,
            }}
        >
            {children}
        </RevenueCatContext.Provider>
    );
};