import React, { useEffect, useState } from 'react';
import { Camera, Check, Truck, CreditCard, IdCard, FileText, Calendar, Phone, Mail, Shield, UploadCloud, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PartnerProfile = () => {
  const [partnerData, setPartnerData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Get partner data from localStorage
    const storedData = localStorage.getItem('partner');
    const storedToken = localStorage.getItem('partner_token');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setPartnerData(parsedData);
      } catch (error) {
        console.error('Error parsing partner data:', error);
      }
    }
    
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      
      // Automatically upload to backend
      await uploadToServer(file);
    }
  };

  const uploadToServer = async (file) => {
    if (!file || !token) return;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('profilePhoto', file);
      
      // Replace with your actual API endpoint
      const response = await axios.post(
        'https://your-api-endpoint.com/upload-profile-photo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Profile photo updated successfully!');
        // Update local storage with new photo URL if returned from API
        if (response.data.profilePhotoUrl) {
          const updatedPartner = {
            ...partnerData,
            t_picture: response.data.profilePhotoUrl
          };
          localStorage.setItem('partner', JSON.stringify(updatedPartner));
          setPartnerData(updatedPartner);
        }
      } else {
        toast.error(response.data.message || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Error uploading photo');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerImageUpload = () => {
    document.getElementById('profilePhotoUpload').click();
  };

  if (!partnerData) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const {
    t_name,
    t_email,
    t_contact,
    t_rc_number,
    t_id_card_details,
    t_pancard_details,
    t_drivinglicence_details,
    t_picture,
    status,
    on_work,
    package_type,
    price,
    truck_type,
    start_date,
    end_date,
  } = partnerData;

  const profileImage = preview || (t_picture === 'placeholder.jpg' ? '/default-avatar.png' : t_picture);

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}

        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative mb-4 sm:mb-0 sm:mr-8">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <input
                  id="profilePhotoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  onClick={triggerImageUpload}
                  disabled={isUploading}
                  className={`absolute bottom-2 right-2 ${isUploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white p-2 rounded-full transition duration-300 shadow-md flex items-center justify-center`}
                  title="Upload Profile Photo"
                >
                  {isUploading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Camera size={18} />
                  )}
                </button>
              </div>
              
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold">{t_name}</h2>
                <div className="flex items-center justify-center sm:justify-start mt-2">
                  <Mail size={16} className="mr-2" />
                  <span>{t_email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start mt-1">
                  <Phone size={16} className="mr-2" />
                  <span>{t_contact}</span>
                </div>
                
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                  <Badge 
                    label="Status" 
                    value={status} 
                    icon={<Shield size={14} className="mr-1" />} 
                  />
                  <Badge 
                    label="Package" 
                    value={package_type} 
                    custom 
                    icon={<Check size={14} className="mr-1" />} 
                  />
                  <Badge 
                    label="On Work" 
                    value={on_work} 
                    icon={<Truck size={14} className="mr-1" />} 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <ProfileSection title="Truck Information">
                  <ProfileItem 
                    label="Truck Type" 
                    value={truck_type} 
                    icon={<Truck size={18} className="text-blue-600" />} 
                  />
                  <ProfileItem 
                    label="RC Number" 
                    value={t_rc_number} 
                    icon={<CreditCard size={18} className="text-blue-600" />} 
                  />
                </ProfileSection>
                
                <ProfileSection title="Document Details">
                  <ProfileItem 
                    label="ID Card" 
                    value={t_id_card_details} 
                    icon={<IdCard size={18} className="text-blue-600" />} 
                  />
                  <ProfileItem 
                    label="PAN Card" 
                    value={t_pancard_details} 
                    icon={<FileText size={18} className="text-blue-600" />} 
                  />
                  <ProfileItem 
                    label="Driving Licence" 
                    value={t_drivinglicence_details} 
                    icon={<FileText size={18} className="text-blue-600" />} 
                  />
                </ProfileSection>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                <ProfileSection title="Contract Details">
                  <ProfileItem 
                    label="Price" 
                    value={`₹${price.toLocaleString('en-IN')}`} 
                    icon={<span className="text-lg font-bold text-blue-600">₹</span>} 
                  />
                  <ProfileItem 
                    label="Start Date" 
                    value={new Date(start_date).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })} 
                    icon={<Calendar size={18} className="text-blue-600" />} 
                  />
                  <ProfileItem 
                    label="End Date" 
                    value={new Date(end_date).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })} 
                    icon={<Calendar size={18} className="text-blue-600" />} 
                  />
                </ProfileSection>
                
                <ProfileSection title="Additional Information">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Account Verification</h4>
                    <div className="space-y-2">
                      <VerificationItem 
                        label="ID Proof" 
                        verified={true} 
                      />
                      <VerificationItem 
                        label="Address Proof" 
                        verified={true} 
                      />
                      <VerificationItem 
                        label="Vehicle Documents" 
                        verified={true} 
                      />
                    </div>
                  </div>
                </ProfileSection>
              </div>
            </div>
            
            {/* Upload Button (alternative to auto-upload) */}
            {selectedFile && !isUploading && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => uploadToServer(selectedFile)}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300"
                >
                  <UploadCloud size={18} className="mr-2" />
                  Confirm Profile Photo Upload
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSection = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const ProfileItem = ({ label, value, icon }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 mr-3 mt-1">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const VerificationItem = ({ label, verified }) => (
  <div className="flex items-center">
    <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-2 ${verified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
      {verified ? <Check size={14} /> : null}
    </div>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </div>
);

const Badge = ({ label, value, custom = false, icon }) => {
  const isActive = value === true || value === 'Yes' || value === 'Gold' || value === 'Platinum' || value === 'Active' || value === 'Premium';
  const colors = custom
    ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white'
    : isActive
    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
    : 'bg-gradient-to-r from-red-500 to-rose-600 text-white';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors} shadow-sm`}>
      {icon}
      <span className="ml-1">{label}: {custom ? value : isActive ? 'Active' : 'Inactive'}</span>
    </span>
  );
};

export default PartnerProfile;