'use client';
import { useBookings } from '../../../hooks/useBookings';
import { SkeletonCard } from '../../../components/ui/SkeletonCard';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import Link from 'next/link';

export default function ConsumerDashboardPage() {
    const { bookings, loading, error } = useBookings();

    if (error) {
        return (
            <main className="flex-grow px-margin-x max-w-container-max mx-auto w-full py-12 flex flex-col gap-gap-standard">
                <div className="bg-error-container text-on-error-container p-6 rounded-xl flex items-center gap-4">
                    <span className="material-symbols-outlined text-4xl">error</span>
                    <div>
                        <h2 className="font-headline-md">Failed to load dashboard</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </main>
        );
    }

    const activeBooking = bookings.find(b => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS' || b.status === 'PENDING_PAYMENT');
    const pastBookings = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED');

    return (
        <main className="flex-grow px-margin-x max-w-container-max mx-auto w-full py-12 flex flex-col gap-gap-standard">
            <header className="mb-8 flex justify-between items-center">
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Welcome back</h1>
                <a href="/dashboard/post-job/" className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md hover:bg-accent-hover transition-colors shadow-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    Post a Custom Job
                </a>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gap-standard">
                {/* Section 1: Active Booking Card */}
                <section className="md:col-span-2 bg-surface-high rounded-xl border border-border-soft p-6 shadow-sm flex flex-col gap-6 relative overflow-hidden h-full min-h-[300px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    
                    {loading ? (
                        <div className="animate-pulse flex flex-col h-full space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2 w-1/2">
                                    <div className="h-6 bg-surface-muted rounded w-1/2"></div>
                                    <div className="h-4 bg-surface-muted rounded w-3/4"></div>
                                </div>
                                <div className="h-6 bg-surface-muted rounded w-24"></div>
                            </div>
                            <div className="flex-1 bg-surface-muted/50 rounded-xl mt-4"></div>
                        </div>
                    ) : activeBooking ? (
                        <>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="font-headline-md text-headline-md text-on-surface">Current Service</h2>
                                    <p className="font-body-md text-body-md text-text-secondary mt-1">{activeBooking.service?.title || activeBooking.service_title || (activeBooking.address_details as any)?.title || 'Custom Service'}</p>
                                </div>
                                <StatusBadge status={activeBooking.status} />
                            </div>
                            
                            <div className="py-8 relative">
                                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border-soft -translate-y-1/2 rounded-full z-0 mt-3 md:mt-4"></div>
                                <div className={`absolute top-1/2 left-0 ${activeBooking.status === 'IN_PROGRESS' ? 'w-[80%]' : 'w-[20%]'} h-[2px] bg-primary -translate-y-1/2 rounded-full z-0 mt-3 md:mt-4 transition-all duration-1000 ease-out`}></div>
                                
                                <div className="relative z-10 flex justify-between items-center w-full">
                                    <div className="flex flex-col items-center gap-2 w-1/3">
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary text-on-primary flex items-center justify-center border-4 border-surface-high shadow-sm">
                                            <span className="material-symbols-outlined text-[14px] md:text-[18px]">check</span>
                                        </div>
                                        <span className="font-label-md text-label-md text-primary text-center">Confirmed</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 w-1/3">
                                        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${activeBooking.status === 'IN_PROGRESS' ? 'bg-primary text-on-primary' : 'bg-surface-high border-4 border-border-soft'} flex items-center justify-center shadow-sm relative`}>
                                            {activeBooking.status === 'IN_PROGRESS' && <div className="w-2 h-2 rounded-full bg-surface-high animate-ping absolute"></div>}
                                        </div>
                                        <span className={`font-label-md text-label-md text-center ${activeBooking.status === 'IN_PROGRESS' ? 'text-primary font-bold' : 'text-text-secondary'}`}>In-Progress</span>
                                    </div>
                                </div>
                            </div>
                            
                            {activeBooking.technician ? (
                                <div className="mt-auto pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-border-soft">
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <div className="w-10 h-10 rounded-full bg-surface-muted overflow-hidden flex-shrink-0 border border-border-soft flex items-center justify-center">
                                            <span className="material-symbols-outlined text-text-secondary">person</span>
                                        </div>
                                        <div>
                                            <p className="font-label-md text-label-md text-on-surface font-semibold">{activeBooking.technician.full_name}</p>
                                            <p className="font-caption text-caption text-text-secondary flex items-center gap-1">Your technician</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-auto pt-4 flex flex-col sm:flex-row justify-center items-center gap-4 border-t border-border-soft">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary animate-pulse">radar</span>
                                        <p className="font-label-md text-label-md text-text-secondary animate-pulse">Looking for a nearby technician...</p>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full flex-1 text-text-secondary space-y-4">
                            <div className="w-24 h-24 bg-surface-muted rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl">home_repair_service</span>
                            </div>
                            <p className="font-body-md text-center">No active bookings right now.</p>
                        </div>
                    )}
                </section>

                {/* Section 2: History Ledger */}
                <section className="md:col-span-1 bg-surface-high rounded-xl border border-border-soft flex flex-col h-full shadow-sm max-h-[500px]">
                    <div className="p-6 border-b border-border-soft flex justify-between items-center">
                        <h2 className="font-headline-md text-headline-md text-on-surface">Recent Services</h2>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-surface-high">
                                <tr className="bg-surface-muted/50 border-b border-border-soft">
                                    <th className="py-3 px-6 font-caption text-caption text-text-secondary font-medium tracking-wider">DATE & SERVICE</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-soft">
                                {loading ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="py-4 px-6 space-y-2">
                                                <div className="h-4 bg-surface-muted rounded w-3/4"></div>
                                                <div className="h-3 bg-surface-muted rounded w-1/2"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : pastBookings.length > 0 ? (
                                    pastBookings.map(b => (
                                        <tr key={b.id} className="hover:bg-surface-muted/30 transition-colors duration-150">
                                            <td className="py-4 px-6">
                                                <p className="font-label-md text-label-md text-on-surface">{b.service?.title || b.service_title || (b.address_details as any)?.title || 'Custom Service'}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className="font-caption text-caption text-text-secondary">{new Date(b.scheduled_start || (b.scheduled_time ? b.scheduled_time.replace(/^\["([^"]+)".*$/, '$1') : new Date())).toLocaleDateString()}</p>
                                                    <StatusBadge status={b.status} className="!text-[10px] !px-2 !py-0.5" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="p-6 text-center text-text-secondary font-body-md">
                                            No past services.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
}
