import React from 'react'

export default function page({ params: { name } }) {

    return (
        <div>
            <div className="mt-[150px] fc px-4 flex-col">
                <div className="mb-5 max-w-[800px]">
                    <h3 className="pri-head mb-1">
                        Successfully booked with <span className="col-pri">Dr. {name}</span>.
                    </h3>
                    <p className="mt-4 text-lg">
                        Your appointment is now confirmed. Dr. {name} will provide you with the best possible care and attention to your health concerns. We’ve got you covered!
                    </p>
                    <p className="mt-2 text-lg">
                        <span className="font-semibold">Appointment Details:</span><br />
                        <span className="text-sm">Date & Time: May 10, 2025 at 3:00 PM</span><br />
                        <span className="text-sm">Location: City Health Center, Main Street, Suite 205</span><br />
                        <span className="text-sm">Please ensure to arrive 15 minutes early for any necessary pre-consultation procedures.</span>
                    </p>
                    <div className="mt-6">
                        <p className="font-semibold text-lg">
                            If you have any questions or need to reschedule, feel free to contact us.
                        </p>
                        <button className="mt-4 p-2 w-full bg-pri text-white rounded-md">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
