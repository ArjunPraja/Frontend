import React, { useEffect, useState } from 'react';
import {
  Camera, Check, Truck, CreditCard, IdCard, FileText,
  Calendar, Phone, Mail, Shield, UploadCloud, Loader2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PartnerProfile = () => {
  const [partnerData, setPartnerData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [token, setToken] = useState('');
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const storedData = localStorage.getItem('partner');
    const storedToken = localStorage.getItem('partner_token');

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setPartnerData(parsedData);
      } catch (error) {
        console.error('Error parsing partner data:', error);
        toast.error('Error loading profile data');
      }
    } else {
      toast.error('No profile data found. Please login again.');
    }

    if (storedToken) {
      setToken(storedToken);
    } else {
      toast.warning('Authentication token not found. Some features may be limited.');
    }

    // Cleanup function for previews
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please select a valid image file.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB.');
      return;
    }

    // Create preview and set selected file
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadToServer = async (file) => {
    if (!file || !token || !partnerData?._id) {
      toast.error('Missing required information for upload');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('photo', file); // Match the expected field name on the server

      const response = await axios.post(
        `${API_BASE_URL}/api/profile/upload-profile-photo/${partnerData._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Handle successful response
      if (response.data && response.data.data) {
        toast.success('Profile photo updated successfully!');
        
        // Update local storage with new picture URL
        const updatedPartner = {
          ...partnerData,
          t_picture: response.data.data.t_picture
        };
        
        localStorage.setItem('partner', JSON.stringify(updatedPartner));
        setPartnerData(updatedPartner);
        
        // Clean up
        setSelectedFile(null);
        setPreview(null);
      } else {
        toast.error(response.data?.message || 'Failed to update profile photo');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Error uploading photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerImageUpload = () => {
    document.getElementById('profilePhotoUpload').click();
  };

  // Loading state
  if (!partnerData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const {
    t_name, t_email, t_contact, t_rc_number, t_id_card_details,
    t_pancard_details, t_drivinglicence_details, t_picture,
    status, on_work, package_type, price = 0, truck_type,
    start_date, end_date
  } = partnerData;

  // Properly handle image path to ensure it's a complete URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-avatar.png';
    if (imagePath === 'placeholder.jpg') return '/default-avatar.png';
    
    // If it's already a full URL
    if (imagePath.startsWith('http')) return imagePath;
    
    // Otherwise, prepend the API base URL
    // Remove leading slash if present to avoid double slashes
    return `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  const profileImage = preview || getImageUrl(t_picture);

  // Format boolean values for display
  const formatBoolean = (value) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value || 'Not specified';
  };

  // Format date or return placeholder text
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Invalid date format:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative mb-4 sm:mb-0 sm:mr-8">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
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
                  className={`absolute bottom-2 right-2 ${
                    isUploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white p-2 rounded-full transition duration-300 shadow-md flex items-center justify-center`}
                  title="Upload Profile Photo"
                >
                  {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                </button>
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold">{t_name || 'Partner Name'}</h2>
                <div className="flex items-center justify-center sm:justify-start mt-2">
                  <Mail size={16} className="mr-2" /> <span>{t_email || 'Email not available'}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start mt-1">
                  <Phone size={16} className="mr-2" /> <span>{t_contact || 'Contact not available'}</span>
                </div>
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                  <Badge label="Status" value={formatBoolean(status)} icon={<Shield size={14} className="mr-1" />} />
                  <Badge label="Package" value={package_type || 'Not assigned'} icon={<Check size={14} className="mr-1" />} />
                  <Badge label="On Work" value={formatBoolean(on_work)} icon={<Truck size={14} className="mr-1" />} />
                </div>
              </div>
            </div>
          </div>

          {/* Detail Section */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ProfileSection title="Truck Information">
                  <ProfileItem label="Truck Type" value={truck_type || 'Not specified'} icon={<Truck size={18} className="text-blue-600" />} />
                  <ProfileItem label="RC Number" value={t_rc_number || 'Not available'} icon={<CreditCard size={18} className="text-blue-600" />} />
                </ProfileSection>

                <ProfileSection title="Document Details">
                  <ProfileItem label="ID Card" value={t_id_card_details || 'Not available'} icon={<IdCard size={18} className="text-blue-600" />} />
                  <ProfileItem label="PAN Card" value={t_pancard_details || 'Not available'} icon={<FileText size={18} className="text-blue-600" />} />
                  <ProfileItem label="Driving Licence" value={t_drivinglicence_details || 'Not available'} icon={<FileText size={18} className="text-blue-600" />} />
                </ProfileSection>
              </div>

              <div className="space-y-6">
                <ProfileSection title="Contract Details">
                  <ProfileItem
                    label="Price"
                    value={price ? `₹${price.toLocaleString('en-IN')}` : 'Not set'}
                    icon={<span className="text-lg font-bold text-blue-600">₹</span>}
                  />
                  <ProfileItem
                    label="Start Date"
                    value={formatDate(start_date)}
                    icon={<Calendar size={18} className="text-blue-600" />}
                  />
                  <ProfileItem
                    label="End Date"
                    value={formatDate(end_date)}
                    icon={<Calendar size={18} className="text-blue-600" />}
                  />
                </ProfileSection>

                <ProfileSection title="Additional Information">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Account Verification</h4>
                    <div className="space-y-2">
                      <VerificationItem label="ID Proof" verified={Boolean(t_id_card_details)} />
                      <VerificationItem label="PAN Card" verified={Boolean(t_pancard_details)} />
                      <VerificationItem label="Driving License" verified={Boolean(t_drivinglicence_details)} />
                    </div>
                  </div>
                </ProfileSection>
              </div>
            </div>

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

// Reusable components
const ProfileSection = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const ProfileItem = ({ label, value, icon }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 mr-3 mt-1">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const VerificationItem = ({ label, verified }) => (
  <div className="flex items-center text-sm">
    {verified ? (
      <Check size={16} className="text-green-600 mr-2" />
    ) : (
      <Shield size={16} className="text-red-600 mr-2" />
    )}
    {label}
  </div>
);

const Badge = ({ label, value, icon }) => (
  <div className="flex items-center px-3 py-1 bg-white rounded-full shadow text-sm text-gray-700 font-medium">
    {icon}
    <span className="mr-1">{label}:</span>
    <span>{value}</span>
  </div>
);

export default PartnerProfile;