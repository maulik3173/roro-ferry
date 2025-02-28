import React from "react";
import TopLayout from "../../layout/toppage/TopLayout";
const TermsOfService = () => {
  return (
    <div className="">
     <div className="w-full space-y-12 pb-16">
        <TopLayout
          bgimg="https://videos.pexels.com/video-files/3994031/3994031-uhd_2560_1440_30fps.mp4"
          title="Terms & Conditions"
        />
      </div>
      <div className="container mx-auto bg-white-50 text-black min-h-screen py-8 px-4">
        {/* <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1> */}
        
        <div className="space-y-4 mr-10 ml-10 font-serif">
          <p>➡️ Outside food not allowed.</p>
          <p>➡️ Please note that INDIGO SEA WAYS PRIVATE LIMITED (HAZIRA GHOGHA RORO FERRY SERVICE) is not liable for any payments made to a personal account belonging to any of its employees. Any transactions made to an employee’s personal account are considered unauthorized and outside the scope of company liability.</p>
          <p>➡️ Current booking closes 45 minutes before scheduled departure. Terminal gates shall be closed 30 minutes before scheduled departure. Entry to the terminal shall not be permitted thereafter. Tickets of passengers/vehicles reporting after the terminal gates close shall be automatically cancelled and no refund shall be issued.</p>
          <p>➡️ All passengers are requested to carry a valid photo ID proof at the time of reporting to the terminal. Free tickets shall be applicable for children below 2 years of age, subject to the presentation of valid age proof. If valid age proof is not presented, the full ticket fare shall be applicable.</p>
          <p>➡️ Passengers are requested to wear the wristband issued from ticket counters throughout the journey. Absence of a wristband shall attract a penalty of Rs. 500/-. The wristband is your responsibility.</p>
          <p>➡️ Priority will always be given to emergency services.</p>
          <p>➡️ Truck drivers are requested to ensure that they have a valid driving license and that the truck is in good condition with valid registration, insurance, and fitness certificate. Truck drivers are requested to produce BILTI/LR & challan at the ticket counter. Boarding the ferry can be denied in the absence of any of the above documents.</p>
          <p>➡️ Smoking/spitting/chewing tobacco on the ferry and within the terminal premises is strictly prohibited and punishable by law. A penalty of Rs. 2500/- shall be charged from defaulters.</p>
          <p>➡️ Carrying & consumption of alcohol or drugs on the ferry and within the terminal premises is strictly prohibited and is punishable by law.</p>
          <p>➡️ All passengers are requested to cooperate for luggage/vehicle scanning.</p>
          <p>➡️ Misconduct with security staff, terminal staff, ferry crew, and fellow passengers is punishable by law.</p>
          <p>➡️ Damage to the ferry/terminal property is punishable by law.</p>
          <p>➡️ The ferry operator is indemnified from any loss to the owner’s belongings.</p>
          <p>➡️ Parking & boarding at owner’s risk.</p>
          <p>➡️ Correction of name is not permitted in a ticket once booked. Please ensure the correct name.</p>
          <p>➡️ Reporting time should be 1 hour prior to departure.</p>
          <p>➡️ The ticket will be valid only till the date of travel prior to departure.</p>
          <p>➡️ Carriage of security-removed articles will not be permitted in hand baggage (e.g.: cutter, knives, explosives, inflammable items, etc.).</p>
          <p>➡️ Passenger belongings carried in hand will be at their own risk. The carrier is in no way liable for any loss or damage.</p>
          <p>➡️ The carrier reserves the right to cancel or change the published voyage for any official purpose or to any extent. The carrier shall bear no liability for any loss that passengers may suffer or any consequences thereof due to bad weather or technical reasons. In this case, passengers can either claim a full refund or reschedule their journey based on availability.</p>
          <p>➡️ The passenger hereby warrants and declares that they, including any accompanying children and/or babies, do not suffer from any major illness or ailments. The carrier shall not be responsible for any consequences resulting from pre-carriage illness/ailments that may manifest during the journey.</p>
          <p>➡️ This ticket and the carriage of passengers & vehicles shall be governed by Indian law, and all disputes shall be referred to the competent court in Surat, Gujarat, India.</p>
          <p>➡️ The carrier shall have no liability for any injury or illness arising from any cause not attributable to the carrier or its staff.</p>
          <p>➡️ Pets and animals are not allowed on board the ferry.</p>
          <p>➡️ If you have been charged twice for your booking or the payment was unsuccessful, you can raise a concern via email at helpdesk@dgferry.com. Our executive will respond within 48 hours. Alternatively, you can contact our customer support center at 9924441847 (Monday to Saturday, 09:30 AM to 05:30 PM).</p>
          <p>➡️ Platform fee/Payment Gateway Charges: By paying the platform fee/payment gateway charges, you gain access to the ease of advance booking from our website/mobile application. This fee is non-refundable.</p>
          <p>➡️ Right of admission reserved.</p>
          <p className="font-bold">Cancellations are allowed only 24 hours prior to departure. GST 18% extra applicable on cancellation charges.</p>
          <p className="font-bold">Refund Policy:</p>
          <table className="w-full border-collapse border border-gray-400 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2">Difference between DOC & DOT</th>
                <th className="border border-gray-400 px-4 py-2">% Refund</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-4 py-2">More than 30 days</td>
                <td className="border border-gray-400 px-4 py-2">90%</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">Between 30 days and 2 days</td>
                <td className="border border-gray-400 px-4 py-2">80%</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">1 day or on Date of Travel</td>
                <td className="border border-gray-400 px-4 py-2">0%</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-4">Refunds will be processed within 7-15 working days after cancellation. In case of cancellation due to bad weather, government orders, or technical circumstances, the booking amount shall be refunded minus taxes/handling/platform fees.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
