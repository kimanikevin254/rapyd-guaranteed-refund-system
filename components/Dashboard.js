"use client";

import React, { useEffect, useState } from "react";

function Dashboard({ checkUserInfo, cardAuthLink, setCardAuthLink }) {
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);

  // Retrieve user details from local storage
  const retrieveUser = () => {
   const userInfo = JSON.parse(localStorage.getItem("user_info"));

   return setUser(userInfo);
  };

  // Set user on initial page load
  useEffect(() => {
   retrieveUser();
  }, []);

  // Log out the user
  const logout = () => {
   localStorage.removeItem("user_info");
   checkUserInfo();
  };

  // Retrieve subscriptions on page load
  const retrieveSubscriptions = async () => {
   try {
       const res = await fetch("/api/subscriptions/list", {
           method: "POST",
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify({ customer_id: user.rapyd_cust_id }),
       });

       const data = await res.json();

       if (data.error) {
           alert(data.error);
       }

       if (data.subscriptions) {
           setSubscriptions(data.subscriptions);
       }
   } catch (error) {
       console.error(error);
   }
  };

   // Retrieve the user's subscriptions on page load 
  useEffect(() => {
   if (user) {
       retrieveSubscriptions();
   }
  }, [user]);

  // Create subscription
  const createSubscription = async () => {
   try {
       const res = await fetch("/api/subscriptions/create", {
           method: "POST",
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify({ customer_id: user.rapyd_cust_id }),
       });

       const data = await res.json();

       if (data.error) {
           alert(data.error);
       }

       if (data.message) {
           // Set the subscriptions to null to trigger loading state
           setSubscriptions(null);

           // Retrieve the subscriptions
           retrieveSubscriptions();
       }
   } catch (error) {
       console.error(error);
   }
  };

  // Cancel subscription and request refund
  const cancelAndRefund = async () => {
   try {
       const res = await fetch("/api/subscriptions/cancelandrefund", {
           method: "POST",
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify({
               subscription_id: subscriptions[0].id,
           }),
       });

       const data = await res.json();

       if (data.error) {
           alert(data.error);
       }

       if (data.message) {
           // Show the message
           alert(data.message);

           // Set the subscriptions to null to trigger loading state
           setSubscriptions(null);

           // Retrieve the subscriptions
           retrieveSubscriptions();
       }
   } catch (error) {
       console.error(error);
   }
  };

   // Track whether the iframe has reloaded  
   const [iframeReloaded, setIframeReloaded] = useState(false);
   // Track if you are checking the customer info   
   const [checkingCustomerInfo, setCheckingCustomerInfo] = useState(false)
   // Track if 3DS auth is required  
   const [nextAction, setNextAction] = useState('3d_verification')

   // Check customer info -> confirm if the card has been authenticated
   const checkCustomerInfo = async () => {
       try {
           // Trigger the "Verifying your payment information..." message
           setCheckingCustomerInfo(true)

           // Retrieve the customer info, specifically the payment method's next_action, using their Rapyd customer ID
           const res = await fetch("/api/auth/retrievecustomer", {
               method: "POST",
               headers: {
                   "Content-Type": "application/json",
               },
               body: JSON.stringify({
                   customer_id: user.rapyd_cust_id
               }),
           });

           const data = await res.json()

           // Hide the "Verifying your payment information..." message
           setCheckingCustomerInfo(false)

           // "not_applicable" means that the card has been authenticated successfully
           if(data.message === "not_applicable"){
               // Update the 3DS Auth link to null and next_action to not_applicable
               // This will display the dashboard
               setCardAuthLink(null)
               setNextAction(data.message)
           }

        } catch (error) {
           console.error(error)
        }
   }   

  // Handle iframe reload
  const handleIframeReload = async () => {
     if (iframeReloaded) {
      
       // Check if the card has been authenticated
       checkCustomerInfo()

     } else {
        // If this is the first load, set the flag for subsequent reload detections
        setIframeReloaded(true);
     }
  };

   // In Rapyd, when you create a customer and immediately try to retrieve their info,
   // the next_action changes to "not_applicable" even if 3DS auth hasn't been performed.
   // To avoid this, we will only check the customer info when the user logs in and avoid this when the user signs up
   // To know when a user signs in, the card auth link will be null
   // You can run the checkUserInfo function only when the cardAuthLink variable is null
  useEffect(() => {
   if(user && cardAuthLink === null){
       checkCustomerInfo()
   }
  }, [user, cardAuthLink])

  return (
   <div className="bg-white p-5 rounded shadow max-w-[600px] w-full mx-auto mt-8">
       {
           cardAuthLink || nextAction === '3d_verification' ?

           <div>

               <p className={checkingCustomerInfo ? "text-2xl font-bold" : "hidden"}>Verifying your payment information...</p>

               <iframe
                   src={cardAuthLink}
                   width="600"
                   height="400"
                   onLoad={handleIframeReload}
                   hidden={checkingCustomerInfo}
               ></iframe>

           </div> :

           <div>
               <div className="flex items-center justify-between">
                   <h2 className="text-lg font-bold">Subscription Dashboard</h2>
                   <button
                       onClick={() => logout()}
                       className="border px-4 py-1 cursor-pointer"
                   >
                       Log out
                   </button>
               </div>

               {subscriptions === null ? (
                   <p className="mb-5">Loading...</p>
               ) : (
                   <div className="mb-5">
                       {subscriptions.length === 0 ? (
                           <div>
                               <p>You do not have an active subscription.</p>

                               <div className="mt-4">
                                   <p>
                                       Subscribe to{" "}
                                       <strong>
                                           CineView Unlimited - Weekly Plan
                                       </strong>{" "}
                                       at $1.99
                                   </p>
                                   <button
                                       onClick={() => createSubscription()}
                                       className="mt-4 bg-green-600 text-white rounded cursor-pointer px-6 py-2"
                                   >
                                       Subscribe Now
                                   </button>
                               </div>
                           </div>
                       ) : (
                           <div>
                               <h3>Your Subscription</h3>
                               <p>
                                   <strong>Plan:</strong>{" "}
                                   {
                                       subscriptions[0].subscription_items.data[0]
                                           .plan.nickname
                                   }
                               </p>
                               <p>
                                   <strong>Status:</strong>{" "}
                                   {subscriptions[0].status
                                       .charAt(0)
                                       .toUpperCase() +
                                       subscriptions[0].status.slice(1)}
                               </p>
                               <p>
                                   <strong>Billed:</strong> $
                                   {
                                       subscriptions[0].subscription_items.data[0]
                                           .plan.amount
                                   }
                                   /{subscriptions[0].subscription_items.data[0].plan.interval}
                               </p>

                               {subscriptions[0].status === "active" && (
                                   <button
                                       onClick={() => cancelAndRefund()}
                                       className="mt-4 bg-red-600 text-white rounded cursor-pointer px-6 py-2"
                                   >
                                       Cancel Subscription
                                   </button>
                               )}
                           </div>
                       )}
                   </div>
               )}
           </div>
       }
   </div>
  );
}

export default Dashboard;
