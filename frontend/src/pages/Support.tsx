import Layout from "../components/Layout";
import { Mail, Phone, MapPin, HelpCircle, Lock, ShoppingBag, MessageSquare } from "lucide-react";

function Support() {
  return (
    <Layout>
      <div className="text-white p-6">
        <h1 className="text-green-400 text-3xl font-bold mb-4">Support</h1>

        <p className="text-blue-900 text-lg mb-6">
          Welcome to Bravo AS support. We're here to help you with any questions or issues you may have.
        </p>

        {/* Contact Information */}
        <div className="mb-6">
          <h2 className="text-green-400 text-2xl font-semibold mb-2">Contact Us</h2>
          <p className="text-gray-400 flex items-center">
            <Mail className="w-5 h-5 text-green-400 mr-2" /> 
            <a href="mailto:support@bravoas.com" className="text-green-400 hover:underline">
              support@bravoas.com
            </a>
          </p>
          <p className="text-gray-400 flex items-center">
            <Phone className="w-5 h-5 text-green-400 mr-2" /> 
            +47 123 45 678
          </p>
          <p className="text-gray-400 flex items-center">
            <MapPin className="w-5 h-5 text-green-400 mr-2" /> 
            Grev Wedels Plass 9, 0151 Oslo
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mb-6">
          <h2 className="text-green-400 text-2xl font-semibold mb-2">Frequently Asked Questions</h2>
          <details className="mb-2">
            <summary className="cursor-pointer text-green-400 hover:underline flex items-center">
              <Lock className="w-5 h-5 mr-2" /> How can I reset my password?
            </summary>
            <p className="text-gray-400 mt-1">You can reset your password by clicking on ‘Forgot Password’ on the login page.</p>
          </details>
          <details className="mb-2">
            <summary className="cursor-pointer text-green-400 hover:underline flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" /> Where can I find my order details?
            </summary>
            <p className="text-gray-400 mt-1">Your order details are available in your account under ‘My Orders’.</p>
          </details>
          <details>
            <summary className="cursor-pointer text-green-400 hover:underline flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" /> How do I contact customer support?
            </summary>
            <p className="text-gray-400 mt-1">You can reach us via email, phone, or our contact form.</p>
          </details>
        </div>

        {/* Image Section */}
        {/* <div className="mb-6 flex justify-center">
          <img 
            src="https://bravosteps.no/wp-content/uploads/2024/12/2-6751a0fe49bc1-1024x1024.webp" 
            alt="Support team" 
            className="max-w-[50px] h-auto rounded-lg shadow-lg max-w-full h-auto"
          />
        </div> */}

        {/* Support Ticket Section */}
        <div>
          <h2 className="text-green-400 text-2xl font-semibold mb-2">Need Further Assistance?</h2>
          <p className="text-gray-400 mb-4">If you need further help, feel free to open a support ticket.</p>
          <a 
            href="/support/ticket" 
            className="bg-green-500 text-white px-4 py-2 rounded flex items-start w-max hover:bg-green-600"
          >
            <MessageSquare className="w-5 h-5 mr-2" /> Open a Support Ticket
          </a>
        </div>
      </div>
    </Layout>
  );
}

export default Support;

