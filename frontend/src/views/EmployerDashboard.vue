<template>
  <div class="min-h-screen bg-gray-100">
    <nav
      class="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow"
    >
      <h1 class="text-xl font-bold">Leave Manager — Employer Panel</h1>
      <div class="flex items-center gap-4">
        <span class="text-sm">Hello, {{ user.name }} 👋</span>
        <button
          @click="logout"
          class="bg-white text-indigo-700 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
    <div class="max-w-5xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">All Leave Requests</h2>
        <div class="flex gap-2">
          <button
            v-for="f in ['All', 'Pending', 'Approved', 'Rejected']"
            :key="f"
            @click="filter = f"
            :class="
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300'
            "
            class="px-3 py-1 rounded-lg text-sm font-medium transition"
          >
            {{ f }}
          </button>
        </div>
      </div>
      <div v-if="loading" class="text-center text-gray-500 py-10">
        Loading leave requests...
      </div>
      <div
        v-else-if="filteredLeaves.length === 0"
        class="bg-white rounded-xl shadow p-10 text-center text-gray-500"
      >
        No {{ filter === "All" ? "" : filter.toLowerCase() }} leave requests
        found.
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="leave in filteredLeaves"
          :key="leave._id"
          class="bg-white rounded-xl shadow p-5 border-l-4"
          :class="{
            'border-yellow-400': leave.status === 'Pending',
            'border-green-500': leave.status === 'Approved',
            'border-red-500': leave.status === 'Rejected',
          }"
        >
          <div class="flex justify-between items-start flex-wrap gap-3">
            <div>
              <p class="font-semibold text-gray-900 text-lg">
                {{ leave.employeeName }}
              </p>
              <p class="text-sm text-gray-500">{{ leave.employeeEmail }}</p>
              <p class="text-sm font-medium text-indigo-600 mt-1">
                {{ leave.leaveType }}
              </p>
              <p class="text-sm text-gray-500 mt-1">
                📅 {{ formatDate(leave.startDate) }} →
                {{ formatDate(leave.endDate) }}
              </p>
              <p class="text-sm text-gray-600 mt-2">{{ leave.reason }}</p>
              <p
                v-if="leave.employerComment"
                class="text-xs text-gray-400 mt-1 italic"
              >
                Your comment: "{{ leave.employerComment }}"
              </p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <span
                class="text-xs font-bold px-3 py-1 rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-700': leave.status === 'Pending',
                  'bg-green-100 text-green-700': leave.status === 'Approved',
                  'bg-red-100 text-red-700': leave.status === 'Rejected',
                }"
                >{{ leave.status }}</span
              >
              <div v-if="leave.status === 'Pending'" class="flex gap-2">
                <button
                  @click="openActionModal(leave, 'Approved')"
                  class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition"
                >
                  Approve
                </button>
                <button
                  @click="openActionModal(leave, 'Rejected')"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-3">
            Applied on {{ formatDate(leave.createdAt) }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="modal.show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50"
    >
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">
          {{ modal.action === "Approved" ? "✅ Approve" : "❌ Reject" }} Leave
          Request
        </h3>
        <p class="text-sm text-gray-500 mb-4">
          Employee: <strong>{{ modal.leave?.employeeName }}</strong> —
          {{ modal.leave?.leaveType }}
        </p>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Comment (optional)</label
        >
        <textarea
          v-model="modal.comment"
          rows="3"
          placeholder="Add a note for the employee..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4"
        ></textarea>
        <div class="flex gap-3">
          <button
            @click="confirmAction"
            :disabled="modal.loading"
            class="flex-1 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            :class="
              modal.action === 'Approved'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            "
          >
            {{ modal.loading ? "Processing..." : "Confirm" }}
          </button>
          <button
            @click="modal.show = false"
            class="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api";
export default {
  name: "EmployerDashboard",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      leaves: [],
      filter: "All",
      loading: false,
      modal: {
        show: false,
        leave: null,
        action: "",
        comment: "",
        loading: false,
      },
    };
  },
  computed: {
    filteredLeaves() {
      if (this.filter === "All") return this.leaves;
      return this.leaves.filter((l) => l.status === this.filter);
    },
  },
  async mounted() {
    await this.loadLeaves();
  },
  methods: {
    async loadLeaves() {
      this.loading = true;
      try {
        const res = await api.get("/leaves/all");
        this.leaves = res.data;
      } catch (err) {
        console.error("Failed to load leaves:", err);
      } finally {
        this.loading = false;
      }
    },
    openActionModal(leave, action) {
      this.modal = { show: true, leave, action, comment: "", loading: false };
    },
    async confirmAction() {
      this.modal.loading = true;
      try {
        await api.put(`/leaves/${this.modal.leave._id}`, {
          status: this.modal.action,
          employerComment: this.modal.comment,
        });
        const idx = this.leaves.findIndex(
          (l) => l._id === this.modal.leave._id,
        );
        if (idx !== -1) {
          this.leaves[idx].status = this.modal.action;
          this.leaves[idx].employerComment = this.modal.comment;
        }
        this.modal.show = false;
      } catch (err) {
        console.error("Failed to update leave:", err);
      } finally {
        this.modal.loading = false;
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
  },
};
</script>
