import {
  gql,
  useQuery,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import Head from "next/head";
import { useState } from "react";
import {
  CircleCheck,
  CircleAlert,
  Ban,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Tally1,
} from "lucide-react";
import {
  usernameOptions,
  emailOptions,
  mobileOptions,
  domainOptions,
} from "../data/filterOptions";
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import SimpleDropdown from '../components/SimpleDropdown';
import DateRangePicker from '../components/DateRangePicker';

const token = process.env.NEXT_PUBLIC_GRAPHQL_JWT;

const GET_MEMBERS = gql`
  query GetMembers($first: Int, $after: Cursor, $filter: MemberFilterInput) {
    members(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          ... on Member {
            name
            verificationStatus
            emailAddress
            mobileNumber
            domain
            dateTimeCreated
            dateTimeLastActive
            status
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;


const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://report.development.opexa.io/graphql",
    headers: {
      Authorization: token,
    },
  }),
  cache: new InMemoryCache(),
});

const MembersTable = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [cursors, setCursors] = useState([null]);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const [filters, setFilters] = useState({
  usernames: [],
  emails: [],
  mobileNumbers: [],
  domains: [],
  verificationStatus: "",
  memberStatus: "",
  dateRange: {
    from: null,
    to: null,
  },
});

  const { loading, error, data, fetchMore, refetch } = useQuery(GET_MEMBERS, {
    variables: {
      first: entriesPerPage,
      after: cursors[currentPage],
      sortBy: sortField,
      sortOrder: sortOrder,
      filter: undefined,
    },
    notifyOnNetworkStatusChange: true,
  });

  const handlePageChange = async (newPage) => {
    if (newPage < 0 || newPage > cursors.length) return;

    if (newPage < cursors.length) {
      setCurrentPage(newPage);
    } else {
      const result = await fetchMore({
        variables: {
          first: entriesPerPage,
          after: cursors[cursors.length - 1],
          sortBy: sortField,
          sortOrder: sortOrder,
        },
      });
      const newCursor = result.data.members.pageInfo.endCursor;
      setCursors((prev) => [...prev, newCursor]);
      setCurrentPage(newPage);
    }
  };

  const handleSortChange = (field, direction) => {
    const normalizedField = field.toUpperCase().replace(/\s+/g, "_");
    const normalizedDirection = direction.toUpperCase();

    setSortField(normalizedField);
    setSortOrder(normalizedDirection);
    setActiveFilter(null);
    setCursors([null]);
    setCurrentPage(0);

    refetch({
      first: entriesPerPage,
      after: null,
      sortBy: normalizedField,
      sortOrder: normalizedDirection,
      filter: undefined,
    });
  };

  const renderVerificationStatus = (status) => {
    let className = "";
    let label = "";
    switch (status) {
      case "VERIFIED":
        className = "status-tag status-verified";
        label = "VERIFIED";
        break;
      case "PENDING":
        className = "status-tag status-pending";
        label = "PENDING";
        break;
      default:
        className = "status-tag status-unverified";
        label = "UNVERIFIED";
        break;
    }
    return (
      <span className={className}>
        <span className="status-circle" />
        {label}
      </span>
    );
  };

  const renderAccountStatus = (status) => {
    let className = "";
    let Icon = null;
    let label = "";
    let labelClass = "";

    switch (status) {
      case "ACTIVE":
        className = "status-tag account-active";
        Icon = CircleCheck;
        label = "ACTIVE";
        break;
      case "BLACKLISTED":
        className = "status-tag account-blacklisted";
        Icon = CircleAlert;
        label = "BLACKLISTED";
        labelClass = "text-white";
        break;
      case "DISABLED":
        className = "status-tag account-disabled";
        Icon = Ban;
        label = "DISABLED";
        break;
      default:
        return <span className="text-gray-400">UNKNOWN</span>;
    }

    return (
      <span className={className}>
        <span className="status-icon-wrapper">
          <Icon size={10} />
        </span>
        <span className={labelClass}>{label}</span>
      </span>
    );
  };

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = String(date.getDate()).padStart(2, "0");
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${year}-${month}-${day} ${timeStr}`;
  };

  const filterFields = [
    "Name",
    "Verification Status",
    "Email Address",
    "Mobile Number",
    "Domain",
    "Date Registered",
    "Status",
    "Date and Time Last Active",
  ];

  if (loading) return <p className="text-[#e5e7eb] p-4">Loading...</p>;
  if (error) return <p className="text-[#ef4444] p-4">Error: {error.message}</p>;


  return (
    <div className="card-style">
      <h1 className="text-2xl font-semibold text-[#e5e7eb] mb-2">Members</h1>
      <p className="text-[#9ca3af] mb-6">View your members here.</p>

      <div className="bg-[#0f172a] border border-gray-700 rounded-xl shadow-lg overflow-hidden">
        {/* Filter Section Header */}
        <div className="filter-buttons-container gap-4 flex flex-wrap mt-2">
        <p className="filter-label">
              Filters
              <Tally1 size={16} className="ml-1" />
        </p>
          <MultiSelectDropdown
            label="Username"
            options={usernameOptions}
            selected={filters.usernames}
            onChange={(val) => setFilters((prev) => ({ ...prev, usernames: val }))}
          />
          <MultiSelectDropdown
            label="Email Address"
            options={emailOptions}
            selected={filters.emails}
            onChange={(val) => setFilters((prev) => ({ ...prev, emails: val }))}
          />
          <MultiSelectDropdown
            label="Mobile Number"
            options={mobileOptions}
            selected={filters.mobileNumbers}
            onChange={(val) => setFilters((prev) => ({ ...prev, mobileNumbers: val }))}
          />
          <MultiSelectDropdown
            label="Domain"
            options={domainOptions}
            selected={filters.domains}
            onChange={(val) => setFilters((prev) => ({ ...prev, domains: val }))}
          />
          <SimpleDropdown
            label="Verification Status"
            options={["Verified", "Pending", "Unverified"]}
            selected={filters.verificationStatus}
            onChange={(val) => setFilters((prev) => ({ ...prev, verificationStatus: val }))}
          />
          <SimpleDropdown
            label="Member Status"
            options={["Active", "Blacklisted", "Disabled"]}
            selected={filters.memberStatus}
            onChange={(val) => setFilters((prev) => ({ ...prev, memberStatus: val }))}
          />
          <DateRangePicker
            selected={filters.dateRange}
            onChange={(range) =>
              setFilters((prev) => ({ ...prev, dateRange: range }))
            }
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#111827] text-[#e5e7eb] text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Verification Status</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Mobile Number</th>
                <th className="px-6 py-3">Domain</th>
                <th className="px-6 py-3">Date Registered</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date and Time Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-[#0f172a] text-[#e5e7eb]">
              {data.members.edges.map(({ node }) => (
                <tr key={node.id} className="hover:bg-[#1f2937]">
                  <td className="px-6 py-4 text-[#fbbd2c] font-medium">{node.name}</td>
                  <td className="px-6 py-4">
                    {renderVerificationStatus(node.verificationStatus)}
                  </td>
                  <td className="px-6 py-4 text-[#d1d5db]">{node.emailAddress}</td>
                  <td className="px-6 py-4 text-[#d1d5db]">{node.mobileNumber}</td>
                  <td className="px-6 py-4 text-[#d1d5db]">{node.domain}</td>
                  <td className="px-6 py-4 text-[#9ca3af]">
                    {formatDateTime(node.dateTimeCreated)}
                  </td>
                  <td className="px-6 py-4">{renderAccountStatus(node.status)}</td>
                  <td className="px-6 py-4 text-[#9ca3af]">
                    {formatDateTime(node.dateTimeLastActive)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-wrapper">
          <div className="entries-container">
            <select
              id="entries"
              className="entries-select"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCursors([null]);
                setCurrentPage(0);
              }}
            >
              {[10, 50, 100].map((count) => (
                <option key={count} value={count}>
                  {count} entries
                </option>
              ))}
            </select>
          </div>

          <div className="pagination-container">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="pagination-btn"
            >
              <ArrowLeft size={16} /> Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!data.members.pageInfo.hasNextPage}
              className="pagination-btn"
            >
              Next <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Scaleforge Test</title>
      </Head>
      <main className="bg-[#0b1120] min-h-screen font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MembersTable />
        </div>
      </main>
    </ApolloProvider>
  );
}
