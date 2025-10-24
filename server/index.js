const http = require('http');
const { URL } = require('url');

const PORT = 3000;

// Mock data - 生成更多用户数据用于分页测试
const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1', bio: '前端开发工程师' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2', bio: 'UI/UX 设计师' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?img=3', bio: '全栈工程师' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?img=4', bio: '产品经理' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', avatar: 'https://i.pravatar.cc/150?img=5', bio: '后端开发工程师' },
  { id: '6', name: 'Diana Prince', email: 'diana@example.com', avatar: 'https://i.pravatar.cc/150?img=6', bio: '移动端开发' },
  { id: '7', name: 'Ethan Hunt', email: 'ethan@example.com', avatar: 'https://i.pravatar.cc/150?img=7', bio: 'DevOps 工程师' },
  { id: '8', name: 'Fiona Gallagher', email: 'fiona@example.com', avatar: 'https://i.pravatar.cc/150?img=8', bio: '数据分析师' },
  { id: '9', name: 'George Miller', email: 'george@example.com', avatar: 'https://i.pravatar.cc/150?img=9', bio: '测试工程师' },
  { id: '10', name: 'Hannah Montana', email: 'hannah@example.com', avatar: 'https://i.pravatar.cc/150?img=10', bio: '技术总监' },
  { id: '11', name: 'Ian Malcolm', email: 'ian@example.com', avatar: 'https://i.pravatar.cc/150?img=11', bio: '架构师' },
  { id: '12', name: 'Julia Roberts', email: 'julia@example.com', avatar: 'https://i.pravatar.cc/150?img=12', bio: 'Scrum Master' },
  { id: '13', name: 'Kevin Hart', email: 'kevin@example.com', avatar: 'https://i.pravatar.cc/150?img=13', bio: '前端开发实习生' },
  { id: '14', name: 'Laura Croft', email: 'laura@example.com', avatar: 'https://i.pravatar.cc/150?img=14', bio: '安全工程师' },
  { id: '15', name: 'Michael Scott', email: 'michael@example.com', avatar: 'https://i.pravatar.cc/150?img=15', bio: '项目经理' },
  { id: '16', name: 'Nancy Drew', email: 'nancy@example.com', avatar: 'https://i.pravatar.cc/150?img=16', bio: 'QA 工程师' },
  { id: '17', name: 'Oscar Isaac', email: 'oscar@example.com', avatar: 'https://i.pravatar.cc/150?img=17', bio: 'AI 工程师' },
  { id: '18', name: 'Pam Beesly', email: 'pam@example.com', avatar: 'https://i.pravatar.cc/150?img=18', bio: 'UX 研究员' },
  { id: '19', name: 'Quinn Fabray', email: 'quinn@example.com', avatar: 'https://i.pravatar.cc/150?img=19', bio: '运维工程师' },
  { id: '20', name: 'Ryan Reynolds', email: 'ryan@example.com', avatar: 'https://i.pravatar.cc/150?img=20', bio: '技术作家' },
  { id: '21', name: 'Sarah Connor', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=21', bio: '系统管理员' },
  { id: '22', name: 'Tom Hanks', email: 'tom@example.com', avatar: 'https://i.pravatar.cc/150?img=22', bio: '云架构师' },
  { id: '23', name: 'Uma Thurman', email: 'uma@example.com', avatar: 'https://i.pravatar.cc/150?img=23', bio: '机器学习工程师' },
  { id: '24', name: 'Victor Hugo', email: 'victor@example.com', avatar: 'https://i.pravatar.cc/150?img=24', bio: '区块链开发者' },
  { id: '25', name: 'Wendy Williams', email: 'wendy@example.com', avatar: 'https://i.pravatar.cc/150?img=25', bio: '技术布道师' },
];

const posts = {
  '1': [
    { id: '1', title: 'First Post', content: 'This is my first post!', createdAt: '2025-01-01' },
    { id: '2', title: 'Second Post', content: 'Another great post!', createdAt: '2025-01-02' },
  ],
  '2': [
    { id: '3', title: 'Jane\'s Post', content: 'Hello world!', createdAt: '2025-01-03' },
  ],
  '3': [
    { id: '4', title: 'Bob\'s Thoughts', content: 'Interesting ideas...', createdAt: '2025-01-04' },
    { id: '5', title: 'More Thoughts', content: 'Even more ideas!', createdAt: '2025-01-05' },
  ],
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Content-Type', 'application/json');

  // GET /users
  if (method === 'GET' && pathname === '/users') {
    const page = parseInt(parsedUrl.searchParams.get('page') || '1');
    const limit = parseInt(parsedUrl.searchParams.get('limit') || '10');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedUsers = users.slice(startIndex, endIndex);
    const totalPages = Math.ceil(users.length / limit);
    const hasMore = page < totalPages;

    // 模拟网络延迟
    setTimeout(() => {
      res.writeHead(200);
      res.end(JSON.stringify({
        data: paginatedUsers,
        pagination: {
          page,
          limit,
          total: users.length,
          totalPages,
          hasMore
        },
      }));
    }, 500);
    return;
  }

  // GET /users/:userId
  const userMatch = pathname.match(/^\/users\/([^\/]+)$/);
  if (method === 'GET' && userMatch) {
    const userId = userMatch[1];
    const user = users.find(u => u.id === userId);

    if (!user) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'User not found' }));
      return;
    }

    res.writeHead(200);
    res.end(JSON.stringify({ data: user }));
    return;
  }

  // POST /users/:userId/posts
  const postsMatch = pathname.match(/^\/users\/([^\/]+)\/posts$/);
  if (method === 'POST' && postsMatch) {
    const userId = postsMatch[1];

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const { page = 1 } = body ? JSON.parse(body) : {};
      const user = users.find(u => u.id === userId);

      if (!user) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'User not found' }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({
        data: posts[userId] || [],
        user,
        page
      }));
    });
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
