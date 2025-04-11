import React from "react";

const RequestCard = ({request}) => {

  const getBloodTypeColor = (bloodType) => {
    if (bloodType.includes('O')) return 'text-red-600';
    if (bloodType.includes('A')) return 'text-blue-600';
    if (bloodType.includes('B')) return 'text-purple-600';
    if (bloodType.includes('AB')) return 'text-green-600';
    return 'text-gray-600 bg-gray-50';
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'Urgent': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-bold ${getBloodTypeColor(request?.bloodType)}`}>{request?.bloodType}</h2>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getUrgencyColor(request?.urgency)}`}>
            {request?.urgency}
          </span>
        </div>

        <div className="space-y-2 text-gray-600">
          <p>
            <span className="font-medium">Patient: </span> {request?.fullName}
          </p>
          <p>
            <span className="font-medium">Distance: </span> 2.3 km away
          </p>
        </div>

        <div className="flex gap-2 mt-6">
          <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors">
            Respond Now
          </button>
          {/* <button className="bg-white hover:bg-gray-100 border border-gray-300 p-3 rounded-md transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button> */}
        </div>
      </div>
    </>
  );
};

export default RequestCard;
