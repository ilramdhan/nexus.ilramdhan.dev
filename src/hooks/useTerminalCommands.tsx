import { useCallback } from 'react';
import { Project, Blog, Resume, TechStack, Profile, Service, Certificate } from '@/types/database';

interface TerminalLine {
  id: string;
  content: string;
  type: 'command' | 'output' | 'error' | 'info';
  timestamp: number;
}

interface UseTerminalCommandsProps {
  setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
  setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
  projects?: Project[];
  blogs?: Blog[];
  resume?: Resume[];
  techStack?: TechStack[];
  profile?: Profile | null;
  services?: Service[];
  certificates?: Certificate[];
}

interface DirectoryStructure {
  [key: string]: DirectoryStructure | null;
}

export const useTerminalCommands = ({
  setLines,
  setCurrentPath,
  projects = [],
  blogs = [],
  resume = [],
  techStack = [],
  profile,
  services = [],
  certificates = [],
}: UseTerminalCommandsProps) => {
  const addOutput = useCallback((content: string, type: 'output' | 'error' | 'info' = 'output') => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random(),
      content,
      type,
      timestamp: Date.now(),
    };
    setLines(prev => [...prev, newLine]);
  }, [setLines]);

  // Build dynamic file system based on data
  const fileSystem: DirectoryStructure = {
    home: {
      ilham: {
        about: null,
        projects: projects.reduce((acc, p) => {
          acc[p.slug || p.title.toLowerCase().replace(/\s+/g, '-')] = null;
          return acc;
        }, {} as DirectoryStructure),
        articles: blogs.reduce((acc, b) => {
          acc[b.slug || b.title.toLowerCase().replace(/\s+/g, '-')] = null;
          return acc;
        }, {} as DirectoryStructure),
        contact: null,
        experience: null,
        education: null,
        skills: null,
        services: null,
        certificates: null,
      }
    }
  };

  const getCurrentDirectory = useCallback((path: string): DirectoryStructure | null => {
    const parts = path.split('/').filter(Boolean);
    let current: DirectoryStructure | null = fileSystem;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part] as DirectoryStructure;
      } else {
        return null;
      }
    }

    return current;
  }, [fileSystem]);

  const normalizePath = useCallback((currentPath: string, targetPath: string): string => {
    if (targetPath.startsWith('/')) {
      return targetPath;
    }

    const parts = currentPath.split('/').filter(Boolean);
    const targetParts = targetPath.split('/').filter(Boolean);

    for (const part of targetParts) {
      if (part === '..') {
        parts.pop();
      } else if (part !== '.') {
        parts.push(part);
      }
    }

    return '/' + parts.join('/');
  }, []);

  // Group tech stack by category
  const groupedSkills = techStack.reduce((acc, tech) => {
    const cat = tech.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tech.name);
    return acc;
  }, {} as Record<string, string[]>);

  // Filter experiences and education
  const experiences = resume.filter(r => r.type === 'experience');
  const education = resume.filter(r => r.type === 'education');

  // Get social links from profile
  const socialLinks = (profile?.social_links || {}) as Record<string, string>;

  const executeCommand = useCallback((command: string, currentPath: string) => {
    const [cmd, ...args] = command.toLowerCase().trim().split(' ');

    switch (cmd) {
      case 'help':
        addOutput('┌─────────────────────────────────────────────────────────────┐');
        addOutput('│                    AVAILABLE COMMANDS                       │');
        addOutput('├─────────────────────────────────────────────────────────────┤');
        addOutput('│ about          - Learn about me                             │');
        addOutput('│ projects       - View portfolio projects                    │');
        addOutput('│ project <n>    - View detailed project info                │');
        addOutput('│ articles       - View blog posts                            │');
        addOutput('│ article <n>    - Read specific article                     │');
        addOutput('│ skills         - Display technical skills                   │');
        addOutput('│ experience     - View work experience                      │');
        addOutput('│ education      - View education background                 │');
        addOutput('│ services       - View services I offer                     │');
        addOutput('│ certificates   - View my certifications                    │');
        addOutput('│ contact        - Get contact information                    │');
        addOutput('│ social         - Show social media links                   │');
        addOutput('│ resume         - Download my CV/Resume                     │');
        addOutput('│ ascii          - Show ASCII art logo                       │');
        addOutput('│ tree           - Show file structure                       │');
        addOutput('│ admin          - Go to admin panel                         │');
        addOutput('│ clear          - Clear terminal screen                     │');
        addOutput('│ ls             - List directory contents                   │');
        addOutput('│ pwd            - Show current directory                    │');
        addOutput('│ cd <dir>       - Change directory                          │');
        addOutput('│ whoami         - Display current user                      │');
        addOutput('│ date           - Show current date and time               │');
        addOutput('└─────────────────────────────────────────────────────────────┘');
        break;

      case 'ascii':
        addOutput('');
        addOutput('  ██╗██╗     ██╗  ██╗ █████╗ ███╗   ███╗');
        addOutput('  ██║██║     ██║  ██║██╔══██╗████╗ ████║');
        addOutput('  ██║██║     ███████║███████║██╔████╔██║');
        addOutput('  ██║██║     ██╔══██║██╔══██║██║╚██╔╝██║');
        addOutput('  ██║███████╗██║  ██║██║  ██║██║ ╚═╝ ██║');
        addOutput('  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝');
        addOutput('');
        addOutput('    ╦═╗ ╔═╗ ╔╦╗ ╔═╗ ╔╦╗ ╦ ╦ ╔═╗ ╔╗╔');
        addOutput('    ╠╦╝ ╠═╣ ║║║ ╠═╣  ║║ ╠═╣ ╠═╣ ║║║');
        addOutput('    ╩╚═ ╩ ╩ ╩ ╩ ╩ ╩ ╩╩╝ ╩ ╩ ╩ ╩ ╝╚╝');
        addOutput('');
        addOutput(`    ${profile?.badge_text || 'Fullstack Developer'}`);
        addOutput('');
        break;

      case 'tree':
        addOutput('portfolio/');
        addOutput('├── about.md');
        addOutput('├── contact.txt');
        addOutput('├── projects/');
        projects.forEach((p, i) => {
          const prefix = i === projects.length - 1 ? '│   └──' : '│   ├──';
          addOutput(`${prefix} ${p.slug || p.title.toLowerCase().replace(/\s+/g, '-')}/`);
        });
        addOutput('├── articles/');
        blogs.forEach((b, i) => {
          const prefix = i === blogs.length - 1 ? '│   └──' : '│   ├──';
          addOutput(`${prefix} ${b.slug || b.title.toLowerCase().replace(/\s+/g, '-')}.md`);
        });
        addOutput('├── experience.json');
        addOutput('├── education.json');
        addOutput('├── services.json');
        addOutput('├── certificates.json');
        addOutput('└── skills.json');
        break;

      case 'articles':
        if (blogs.length === 0) {
          addOutput('No articles available yet.', 'info');
        } else {
          addOutput('┌─────────────────────────────────────────────────────────────┐');
          addOutput('│                      BLOG ARTICLES                          │');
          addOutput('└─────────────────────────────────────────────────────────────┘');
          addOutput('');
          blogs.slice(0, 6).forEach((article, index) => {
            addOutput(`${index + 1}. ${article.title}`);
            addOutput(`   📅 ${article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Draft'}`);
            addOutput(`   📝 ${article.excerpt || 'No description'}`);
            if (article.tags?.length) addOutput(`   🏷️ Tags: ${article.tags.join(', ')}`);
            addOutput('');
          });
          addOutput('💡 Use "article <number>" to read full article');
        }
        break;

      case 'experience':
        addOutput('┌─────────────────────────────────────────────────────────────┐');
        addOutput('│                    WORK EXPERIENCE                          │');
        addOutput('└─────────────────────────────────────────────────────────────┘');
        addOutput('');
        if (experiences.length === 0) {
          addOutput('No work experience entries yet.', 'info');
        } else {
          experiences.forEach((exp) => {
            addOutput(`🏢 ${exp.title} @ ${exp.institution || 'Unknown'}`);
            addOutput(`   📅 ${exp.period || 'N/A'}`);
            if (exp.description) addOutput(`   • ${exp.description}`);
            addOutput('');
          });
        }
        break;

      case 'education':
        addOutput('┌─────────────────────────────────────────────────────────────┐');
        addOutput('│                       EDUCATION                             │');
        addOutput('└─────────────────────────────────────────────────────────────┘');
        addOutput('');
        if (education.length === 0) {
          addOutput('No education entries yet.', 'info');
        } else {
          education.forEach((edu) => {
            addOutput(`🎓 ${edu.title}`);
            addOutput(`   🏫 ${edu.institution || 'Unknown'}`);
            addOutput(`   📅 ${edu.period || 'N/A'}`);
            if (edu.gpa) addOutput(`   📊 GPA: ${edu.gpa}`);
            if (edu.description) addOutput(`   • ${edu.description}`);
            addOutput('');
          });
        }
        break;

      case 'services':
      case 'whatido':
        addOutput('┌─────────────────────────────────────────────────────────────┐');
        addOutput('│                    SERVICES I OFFER                         │');
        addOutput('└─────────────────────────────────────────────────────────────┘');
        addOutput('');
        if (services.length === 0) {
          addOutput('No services listed yet.', 'info');
        } else {
          services.forEach((service, index) => {
            addOutput(`${index + 1}. 🛠️ ${service.title}`);
            if (service.description) addOutput(`   ${service.description}`);
            addOutput('');
          });
        }
        break;

      case 'certificates':
      case 'certs':
        addOutput('┌─────────────────────────────────────────────────────────────┐');
        addOutput('│                    MY CERTIFICATIONS                        │');
        addOutput('└─────────────────────────────────────────────────────────────┘');
        addOutput('');
        if (certificates.length === 0) {
          addOutput('No certificates yet.', 'info');
        } else {
          certificates.forEach((cert, index) => {
            addOutput(`${index + 1}. 🏆 ${cert.title}`);
            if (cert.issued_by) addOutput(`   📋 Issued by: ${cert.issued_by}`);
            if (cert.issued_date) addOutput(`   📅 Date: ${cert.issued_date}`);
            if (cert.credential_url) addOutput(`   🔗 Verify: ${cert.credential_url}`);
            addOutput('');
          });
        }
        break;

      case 'resume':
      case 'cv':
      case 'download':
        if (profile?.resume_url) {
          addOutput('📄 Download my CV/Resume:');
          addOutput(`   🔗 ${profile.resume_url}`);
          addOutput('');
          addOutput('Opening download link...', 'info');
          window.open(profile.resume_url, '_blank');
        } else {
          addOutput('Resume/CV not available yet.', 'info');
        }
        break;

      case 'admin':
      case 'login':
        addOutput('🔐 Opening Admin Panel...', 'info');
        window.location.href = '/admin/login';
        break;

      case 'about':
        addOutput(`=== About ${profile?.display_name || 'Me'} ===`);
        addOutput('');
        if (profile?.detailed_bio) {
          addOutput(profile.detailed_bio);
        } else if (profile?.short_description) {
          addOutput(profile.short_description);
        } else {
          addOutput('Fullstack Developer passionate about building');
          addOutput('scalable web applications with modern technologies.');
        }
        break;

      case 'projects':
        if (projects.length === 0) {
          addOutput('No projects available yet.', 'info');
        } else {
          addOutput('┌─────────────────────────────────────────────────────────────┐');
          addOutput('│                     PORTFOLIO PROJECTS                      │');
          addOutput('└─────────────────────────────────────────────────────────────┘');
          addOutput('');
          projects.forEach((project, index) => {
            const featured = project.is_featured ? ' ⭐' : '';
            addOutput(`${index + 1}. ${project.title}${featured}`);
            addOutput(`   🔧 ${project.tech_stack?.join(', ') || 'N/A'}`);
            addOutput(`   📝 ${project.short_description || 'No description'}`);
            addOutput('');
          });
          addOutput('💡 Use "project <number>" for detailed view');
        }
        break;

      case 'skills':
        addOutput('=== Technical Skills ===');
        addOutput('');
        if (Object.keys(groupedSkills).length === 0) {
          addOutput('No skills added yet.', 'info');
        } else {
          Object.entries(groupedSkills).forEach(([category, skills]) => {
            addOutput(`• ${category}: ${skills.join(', ')}`);
          });
        }
        break;

      case 'contact':
      case 'social':
        addOutput('=== Contact Information ===');
        addOutput('');
        if (socialLinks.email) addOutput(`📧 Email: ${socialLinks.email}`);
        if (socialLinks.linkedin) addOutput(`🔗 LinkedIn: ${socialLinks.linkedin}`);
        if (socialLinks.github) addOutput(`🐙 GitHub: ${socialLinks.github}`);
        if (socialLinks.twitter) addOutput(`🐦 Twitter: ${socialLinks.twitter}`);
        if (socialLinks.website) addOutput(`🌐 Website: ${socialLinks.website}`);
        if (socialLinks.phone) addOutput(`📱 Phone: ${socialLinks.phone}`);
        if (Object.keys(socialLinks).length === 0) {
          addOutput('Contact information not configured yet.', 'info');
        }
        break;

      case 'ls': {
        const listPath = args[0] ? normalizePath(currentPath || '/home/ilham', args[0]) : currentPath || '/home/ilham';
        const listDir = getCurrentDirectory(listPath);

        if (listDir && typeof listDir === 'object') {
          const items = Object.keys(listDir).map(name => {
            const isDir = listDir[name] !== null;
            return isDir ? `${name}/` : name;
          });
          if (items.length === 0) {
            addOutput('(empty directory)');
          } else {
            addOutput(items.join('  '));
          }
        } else {
          addOutput(`ls: ${args[0] || '.'}: No such file or directory`, 'error');
        }
        break;
      }

      case 'pwd':
        addOutput(currentPath || '/home/ilham');
        break;

      case 'cd': {
        const targetPath = args[0] || '/home/ilham';
        const newPath = normalizePath(currentPath || '/home/ilham', targetPath);
        const targetDir = getCurrentDirectory(newPath);

        if (targetDir !== null) {
          setCurrentPath(newPath);
          addOutput(`Changed directory to ${newPath}`);
        } else {
          addOutput(`cd: ${targetPath}: No such file or directory`, 'error');
        }
        break;
      }

      case 'whoami':
        addOutput(profile?.display_name?.toLowerCase().replace(/\s+/g, '.') || 'guest');
        break;

      case 'date':
        addOutput(new Date().toString());
        break;

      case 'clear':
        setLines([]);
        break;

      case 'project': {
        const projectIndex = parseInt(args[0]) - 1;
        const project = projects[projectIndex] || projects.find(p =>
          p.slug === args[0] || p.title.toLowerCase().includes(args[0])
        );

        if (project) {
          addOutput('┌─────────────────────────────────────────────────────────────┐');
          addOutput(`│  ${project.title.toUpperCase().padEnd(55).slice(0, 55)} │`);
          addOutput('└─────────────────────────────────────────────────────────────┘');
          addOutput('');
          addOutput(`🔧 Tech Stack: ${project.tech_stack?.join(', ') || 'N/A'}`);
          addOutput(`📝 Description: ${project.short_description || 'No description'}`);
          addOutput('');
          if (project.content) {
            addOutput('📖 Details:');
            addOutput(project.content);
            addOutput('');
          }
          addOutput('🔗 Links:');
          if (project.repo_url) addOutput(`   📂 GitHub: ${project.repo_url}`);
          if (project.demo_url) addOutput(`   🚀 Live Demo: ${project.demo_url}`);
        } else if (args[0]) {
          addOutput('Project not found. Use "projects" to see available projects.', 'error');
        } else {
          addOutput('Usage: project <number> or project <slug>', 'error');
        }
        break;
      }

      case 'article': {
        const articleIndex = parseInt(args[0]) - 1;
        const article = blogs[articleIndex] || blogs.find(b =>
          b.slug === args[0] || b.title.toLowerCase().includes(args[0])
        );

        if (article) {
          addOutput('┌─────────────────────────────────────────────────────────────┐');
          addOutput(`│                      ARTICLE                                │`);
          addOutput('└─────────────────────────────────────────────────────────────┘');
          addOutput('');
          addOutput(`📰 ${article.title}`);
          addOutput(`📅 Published: ${article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Draft'}`);
          addOutput('');
          if (article.excerpt) {
            addOutput('📝 Summary:');
            addOutput(`   ${article.excerpt}`);
            addOutput('');
          }
          if (article.content) {
            addOutput('📖 Content:');
            addOutput(article.content.slice(0, 500) + (article.content.length > 500 ? '...' : ''));
          }
          if (article.tags?.length) addOutput(`\n🏷️ Tags: ${article.tags.join(', ')}`);
        } else if (args[0]) {
          addOutput('Article not found. Use "articles" to see available articles.', 'error');
        } else {
          addOutput('Usage: article <number> or article <slug>', 'error');
        }
        break;
      }

      case 'cat':
        if (args[0] === 'about.md') {
          addOutput(`=== About ${profile?.display_name || 'Me'} ===`);
          addOutput('');
          addOutput(profile?.detailed_bio || profile?.short_description || 'No bio available.');
        } else if (args[0] === 'contact.txt') {
          Object.entries(socialLinks).forEach(([key, value]) => {
            if (value) addOutput(`${key}: ${value}`);
          });
        } else if (args[0] === 'skills.json') {
          addOutput(JSON.stringify(groupedSkills, null, 2));
        } else {
          addOutput(`cat: ${args[0]}: No such file`, 'error');
        }
        break;

      default:
        addOutput(`Command not found: ${cmd}`, 'error');
        addOutput('Type "help" to see available commands.');
        break;
    }
  }, [setLines, addOutput, setCurrentPath, getCurrentDirectory, normalizePath, projects, blogs, experiences, education, services, certificates, groupedSkills, profile, socialLinks]);

  const getAvailableCommands = useCallback(() => {
    return ['help', 'about', 'projects', 'project', 'articles', 'article', 'skills', 'experience', 'education', 'services', 'certificates', 'contact', 'social', 'resume', 'cv', 'admin', 'ascii', 'tree', 'cat', 'clear', 'ls', 'pwd', 'cd', 'whoami', 'date'];
  }, []);

  return {
    executeCommand,
    getAvailableCommands,
  };
};