<template>
  <div class="min-h-screen bg-gray-100">
    <nav
      class="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow"
    >
      <h1 class="text-xl font-bold">Leave Manager</h1>
      <div class="flex items-center gap-4">
        <span class="text-sm">Hello, {{ user.name }} 👋</span>
        <button
          @click="logout"
          class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex gap-3 mb-6">
        <button
          @click="activeTab = 'apply'"
          :class="
            activeTab === 'apply'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 border border-gray-300'
          "
          class="px-5 py-2 rounded-lg font-medium transition"
        >
          Apply for Leave
        </button>
        <button
          @click="
            activeTab = 'status';
            loadLeaves();
          "
          :class="
            activeTab === 'status'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 border border-gray-300'
          "
          class="px-5 py-2 rounded-lg font-medium transition"
        >
          My Applications
        </button>
      </div>
      <div v-if="activeTab === 'apply'" class="bg-white rounded-xl shadow p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-5">
          Apply for Leave
        </h2>
        <div
          v-if="applySuccess"
          class="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm"
        >
          {{ applySuccess }}
        </div>
        <div
          v-if="applyError"
          class="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm"
        >
          {{ applyError }}
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Leave Type</label
            >
            <select
              v-model="form.leaveType"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Leave Type --</option>
              <option>Annual Leave</option>
              <option>Sick Leave</option>
              <option>Emergency Leave</option>
              <option>Maternity/Paternity Leave</option>
              <option>Unpaid Leave</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Start Date</label
              >
              <input
                v-model="form.startDate"
                type="date"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >End Date</label
              >
              <input
                v-model="form.endDate"
                type="date"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Reason</label
            >
            <textarea
              v-model="form.reason"
              rows="4"
              placeholder="Briefly explain why you need leave..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>
          <button
            @click="submitLeave"
            :disabled="submitting"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {{ submitting ? "Submitting..." : "Submit Application" }}
          </button>
        </div>
      </div>
      <div v-if="activeTab === 'status'">
        <div v-if="loadingLeaves" class="text-center text-gray-500 py-10">
          Loading your applications...
        </div>
        <div
          v-else-if="leaves.length === 0"
          class="bg-white rounded-xl shadow p-10 text-center text-gray-500"
        >
          You haven't applied for any leave yet.
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="leave in leaves"
            :key="leave._id"
            class="bg-white rounded-xl shadow p-5 border-l-4"
            :class="{
              'border-yellow-400': leave.status === 'Pending',
              'border-green-500': leave.status === 'Approved',
              'border-red-500': leave.status === 'Rejected',
            }"
          >
            <div class="flex justify-between items-start">
              <div>
                <span class="font-semibold text-gray-800 text-lg">{{
                  leave.leaveType
                }}</span>
                <p class="text-sm text-gray-500 mt-1">
                  📅 {{ formatDate(leave.startDate) }} →
                  {{ formatDate(leave.endDate) }}
                </p>
                <p class="text-sm text-gray-600 mt-2">{{ leave.reason }}</p>
                <p
                  v-if="leave.employerComment"
                  class="text-sm text-gray-500 mt-1 italic"
                >
                  Manager note: "{{ leave.employerComment }}"
                </p>
              </div>
              <span
                class="text-xs font-bold px-3 py-1 rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-700': leave.status === 'Pending',
                  'bg-green-100 text-green-700': leave.status === 'Approved',
                  'bg-red-100 text-red-700': leave.status === 'Rejected',
                }"
                >{{ leave.status }}</span
              >
            </div>
            <p class="text-xs text-gray-400 mt-3">
              Applied on {{ formatDate(leave.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api";
export default {
  name: "EmployeeDashboard",
  data() {
    return {
      activeTab: "apply",
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      form: { leaveType: "", startDate: "", endDate: "", reason: "" },
      leaves: [],
      submitting: false,
      loadingLeaves: false,
      applySuccess: "",
      applyError: "",
    };
  },
  methods: {
    async submitLeave() {
      this.applyError = "";
      this.applySuccess = "";
      this.submitting = true;
      try {
        await api.post("/leaves", this.form);
        this.applySuccess = "✅ Leave application submitted successfully!";
        this.form = { leaveType: "", startDate: "", endDate: "", reason: "" };
      } catch (err) {
        this.applyError =
          err.response?.data?.message || "Failed to submit. Please try again.";
      } finally {
        this.submitting = false;
      }
    },
    async loadLeaves() {
      this.loadingLeaves = true;
      try {
        const res = await api.get("/leaves/my");
        this.leaves = res.data;
      } catch (err) {
        console.error("Failed to load leaves:", err);
      } finally {
        this.loadingLeaves = false;
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
