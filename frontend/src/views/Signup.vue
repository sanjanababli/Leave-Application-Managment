<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
      <h1 class="text-3xl font-bold text-center text-blue-600 mb-2">
        Leave Manager
      </h1>
      <p class="text-center text-gray-500 mb-6">Create your account</p>
      <div
        v-if="success"
        class="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm"
      >
        {{ success }}
      </div>
      <div
        v-if="error"
        class="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm"
      >
        {{ error }}
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Full Name</label
          >
          <input
            v-model="name"
            type="text"
            placeholder="John Doe"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Password (min 6 characters)</label
          >
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >I am a...</label
          >
          <select
            v-model="role"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="employee">Employee</option>
            <option value="employer">Employer / Manager</option>
          </select>
        </div>
        <button
          @click="handleSignup"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
        >
          {{ loading ? "Creating account..." : "Create Account" }}
        </button>
      </div>
      <p class="text-center text-sm text-gray-500 mt-6">
        Already have an account?
        <router-link
          to="/login"
          class="text-blue-600 hover:underline font-medium"
          >Sign In</router-link
        >
      </p>
    </div>
  </div>
</template>

<script>
import api from "../api";
export default {
  name: "Signup",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      role: "employee",
      error: "",
      success: "",
      loading: false,
    };
  },
  methods: {
    async handleSignup() {
      this.error = "";
      this.loading = true;
      try {
        const res = await api.post("/auth/signup", {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        this.$router.push(
          res.data.user.role === "employer" ? "/employer" : "/employee",
        );
      } catch (err) {
        this.error =
          err.response?.data?.message || "Signup failed. Please try again.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
