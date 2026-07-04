const mockData = {
  currentUser: {
    id: 1,
    name: "Joshua Fernandes",
    username: "joshua",
    email: "joshua@example.com",
    role: "Frontend Developer",
    bio: "Building modern web applications.",
    avatar: "/avatars/joshua.jpg",
    followers: 1240,
    following: 326
  },

  users: [
    {
      id: 2,
      name: "Sarah Wilson",
      role: "UI/UX Designer",
      avatar: "/avatars/sarah.jpg"
    },
    {
      id: 3,
      name: "Michael Johnson",
      role: "Software Engineer",
      avatar: "/avatars/michael.jpg"
    },
    {
      id: 4,
      name: "Emma Davis",
      role: "Product Manager",
      avatar: "/avatars/emma.jpg"
    }
  ],

  posts: [
    {
      id: 1,
      authorId: 2,
      content: "Excited to launch our new platform today! 🚀",
      image: "/posts/post1.jpg",
      likes: 152,
      comments: 28,
      shares: 14,
      time: "2h ago"
    },
    {
      id: 2,
      authorId: 3,
      content: "Working on an awesome React project.",
      image: "",
      likes: 87,
      comments: 9,
      shares: 3,
      time: "5h ago"
    }
  ],

  stories: [
    {
      id: 1,
      userId: 2,
      image: "/stories/story1.jpg"
    },
    {
      id: 2,
      userId: 3,
      image: "/stories/story2.jpg"
    }
  ],

  notifications: [
    {
      id: 1,
      text: "Sarah liked your post.",
      time: "10m ago"
    },
    {
      id: 2,
      text: "Michael started following you.",
      time: "1h ago"
    }
  ],

  messages: [
    {
      id: 1,
      userId: 2,
      lastMessage: "Let's catch up later!",
      unread: 2
    },
    {
      id: 2,
      userId: 3,
      lastMessage: "Project looks amazing.",
      unread: 0
    }
  ],

  jobs: [
    {
      id: 1,
      company: "Google",
      title: "Frontend Developer",
      location: "Remote"
    },
    {
      id: 2,
      company: "Microsoft",
      title: "React Developer",
      location: "Bangalore"
    }
  ],

  companies: [
    {
      id: 1,
      name: "OpenAI",
      followers: "2.1M"
    },
    {
      id: 2,
      name: "Google",
      followers: "12M"
    }
  ]
};

export default mockData;