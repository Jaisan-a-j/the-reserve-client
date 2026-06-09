import { Mail, UserRound } from "lucide-react";
import type { UserType } from "../../types";

type ProfileHeaderProps = {
  user: UserType | null;
};

const ProfileHeader = ({ user }: ProfileHeaderProps) => (
  <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#f5f2ff] text-[#633df1]">
          <UserRound size={30} strokeWidth={2.4} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#633df1]">
            My Account
          </p>
          <h1 className="mt-1 truncate text-3xl font-bold tracking-tight">
            {user?.fullName ?? "Reserve Guest"}
          </h1>
        </div>
      </div>
    </div>

    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-gray-200 bg-[#fbfbfd] p-5">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
          <UserRound size={17} strokeWidth={2.3} />
          Full name
        </div>
        <p className="mt-2 text-lg font-bold">
          {user?.fullName ?? "Not available"}
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-[#fbfbfd] p-5">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
          <Mail size={17} strokeWidth={2.3} />
          Email address
        </div>
        <p className="mt-2 break-words text-lg font-bold">
          {user?.email ?? "Not available"}
        </p>
      </div>
    </div>
  </section>
);

export default ProfileHeader;
