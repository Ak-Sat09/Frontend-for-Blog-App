import { useState } from 'react';

export default function Portfolio() {
    const [activeSection, setActiveSection] = useState('home');

    const experiences = [
        {
            role: 'Software Trainee',
            company: 'Uway Software Solutions LLP',
            location: 'Remote',
            period: 'Jun 2025 - Nov 2025',
            achievements: [
                'Optimized User Module email verification from 10s to 113ms using Asynchronous Programming',
                'Diagnosed and resolved SQL query bugs, enhancing performance and efficiency',
                'Accelerated API response time from 500ms to 9ms using caching techniques',
                'Refined code quality by debugging legacy modules and components'
            ]
        }
    ];

    const projects = [
        {
            id: 1,
            title: 'Coupon And Voucher Buying And Selling',
            type: 'Microservices',
            description: 'Platform for buy/sell coupons for 10,000+ users with secured code masking',
            tech: ['Java', 'Spring Boot', 'MySQL'],
            highlights: [
                'Built asynchronous notification system using BlockingQueue and ExecutorService',
                'Applied Observer Design Pattern for Email/SMS notifications',
                'Implemented rate limiter using Resilience4j to prevent excessive API calls'
            ],
            image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=500&fit=crop'
        },
        {
            id: 2,
            title: 'Medicine Ordering and Delivery System',
            type: 'Microservices',
            description: 'Online medicine ordering delivery system using REST-based microservices',
            tech: ['Java 17', 'Spring Boot', 'MySQL'],
            highlights: [
                'Applied Optimistic Locking to prevent race conditions',
                'Configured Retry + DLQ + Fallback for reliability',
                'Implemented Idempotency Key Lock to block duplicate purchases'
            ],
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop'
        }
    ];

    const skills = {
        'Core Strengths': ['Data Structures & Algorithms', 'System Design'],
        'Programming Languages': ['Java'],
        'Frameworks & Libraries': ['Spring Boot', 'Spring Data JPA'],
        'Tools & Technologies': ['Git', 'GitHub'],
        'Databases': ['MySQL']
    };

    const stats = [
        { number: '6+', label: 'Months Experience' },
        { number: '2+', label: 'Projects Done' },
        { number: '100+', label: 'DSA Problems Solved' }
    ];

    return (
        <div style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            background: '#1a1a1a',
            color: '#fff',
            minHeight: '100vh'
        }}>
            {/* Navigation */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                background: 'rgba(26, 26, 26, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '20px 0',
                zIndex: 1000,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#FF6B00',
                        letterSpacing: '1px'
                    }}>
                        ANMOL
                    </div>
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                        {['Home', 'Services', 'About me', 'Portfolio', 'Contact me'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(' ', '-')}`}
                                onClick={() => setActiveSection(item.toLowerCase())}
                                style={{
                                    color: activeSection === item.toLowerCase() ? '#FF6B00' : '#999',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    fontSize: '16px',
                                    transition: 'color 0.3s',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={(e) => e.target.style.color = '#FF6B00'}
                                onMouseOut={(e) => {
                                    if (activeSection !== item.toLowerCase()) {
                                        e.target.style.color = '#999';
                                    }
                                }}
                            >
                                {item}
                            </a>
                        ))}
                        <button style={{
                            padding: '12px 28px',
                            background: '#FF6B00',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                        }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Hire Me
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                padding: '100px 40px 60px',
                background: '#1a1a1a'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '60px',
                    alignItems: 'center'
                }}>
                    <div>
                        <div style={{
                            fontSize: '18px',
                            color: '#999',
                            marginBottom: '10px',
                            fontWeight: '500'
                        }}>
                            Hi I am
                        </div>
                        <h1 style={{
                            fontSize: '48px',
                            fontWeight: '600',
                            margin: '0 0 10px 0',
                            color: '#ccc'
                        }}>
                            Anmol Mehla
                        </h1>
                        <h2 style={{
                            fontSize: '72px',
                            fontWeight: '700',
                            margin: '0 0 30px 0',
                            color: '#FF6B00',
                            lineHeight: '1.1'
                        }}>
                            Software<br />Engineer
                        </h2>
                        <p style={{
                            fontSize: '16px',
                            color: '#999',
                            lineHeight: '1.8',
                            marginBottom: '30px',
                            maxWidth: '550px'
                        }}>
                            Skilled in Java, Spring Boot, and MySQL with a strong foundation in Data Structures and Algorithms.
                            Proven ability to build scalable backend systems and microservices architecture.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            marginBottom: '40px'
                        }}>
                            {[
                                { icon: '📷', link: 'https://github.com/Ak-Sat09' },
                                { icon: '💼', link: 'https://linkedin.com/in/anmehla09' },
                                { icon: '🌐', link: 'https://leetcode.com/u/AkMehla09' },
                                { icon: '🎨', link: 'https://github.com/Ak-Sat09' }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        background: '#2a2a2a',
                                        border: '1px solid #3a3a3a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        textDecoration: 'none',
                                        fontSize: '20px'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = '#FF6B00';
                                        e.currentTarget.style.borderColor = '#FF6B00';
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = '#2a2a2a';
                                        e.currentTarget.style.borderColor = '#3a3a3a';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <button style={{
                                padding: '16px 40px',
                                background: '#FF6B00',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                Hire Me
                            </button>
                            <button style={{
                                padding: '16px 40px',
                                background: 'transparent',
                                border: '2px solid #3a3a3a',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                                onMouseOver={(e) => {
                                    e.target.style.borderColor = '#FF6B00';
                                    e.target.style.color = '#FF6B00';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.borderColor = '#3a3a3a';
                                    e.target.style.color = '#fff';
                                }}
                            >
                                Download CV
                            </button>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: '500px',
                            height: '600px',
                            position: 'relative'
                        }}>
                            <img
                                src="https://res.cloudinary.com/dcnejt8lw/image/upload/v1/2ddd586b603f431f784fbce9c13adeb0"
                                alt="Anmol Mehla"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    filter: 'grayscale(100%) contrast(1.1)',
                                    borderRadius: '0 0 200px 0'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{
                padding: '60px 40px',
                background: '#1a1a1a',
                borderTop: '1px solid #2a2a2a',
                borderBottom: '1px solid #2a2a2a'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '60px',
                    textAlign: 'center'
                }}>
                    {stats.map((stat, i) => (
                        <div key={i}>
                            <div style={{
                                fontSize: '56px',
                                fontWeight: '700',
                                color: '#FF6B00',
                                marginBottom: '10px'
                            }}>
                                {stat.number}
                            </div>
                            <div style={{
                                fontSize: '18px',
                                color: '#999',
                                fontWeight: '500'
                            }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Services/Skills Section */}
            <section id="services" style={{
                padding: '100px 40px',
                background: '#1a1a1a'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '48px',
                        fontWeight: '700',
                        marginBottom: '60px',
                        textAlign: 'center'
                    }}>
                        My <span style={{ color: '#FF6B00' }}>Skills</span>
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '30px'
                    }}>
                        {Object.entries(skills).map(([category, items]) => (
                            <div
                                key={category}
                                style={{
                                    background: '#222',
                                    borderRadius: '12px',
                                    padding: '35px',
                                    border: '1px solid #2a2a2a',
                                    transition: 'all 0.3s',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#FF6B00';
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#2a2a2a';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    marginBottom: '20px',
                                    color: '#FF6B00'
                                }}>
                                    {category}
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '10px'
                                }}>
                                    {items.map((skill) => (
                                        <span
                                            key={skill}
                                            style={{
                                                padding: '8px 16px',
                                                background: '#2a2a2a',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                color: '#ccc',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Me / Experience Section */}
            <section id="about-me" style={{
                padding: '100px 40px',
                background: '#202020'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '48px',
                        fontWeight: '700',
                        marginBottom: '60px',
                        textAlign: 'center'
                    }}>
                        About <span style={{ color: '#FF6B00' }}>Me</span>
                    </h2>
                    {experiences.map((exp, index) => (
                        <div
                            key={index}
                            style={{
                                background: '#1a1a1a',
                                borderRadius: '16px',
                                padding: '45px',
                                border: '1px solid #2a2a2a'
                            }}
                        >
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{
                                    fontSize: '32px',
                                    fontWeight: '700',
                                    marginBottom: '10px',
                                    color: '#fff'
                                }}>
                                    {exp.role}
                                </h3>
                                <div style={{
                                    fontSize: '20px',
                                    color: '#FF6B00',
                                    fontWeight: '600',
                                    marginBottom: '10px'
                                }}>
                                    {exp.company} • {exp.location}
                                </div>
                                <div style={{
                                    fontSize: '16px',
                                    color: '#999',
                                    fontWeight: '500'
                                }}>
                                    {exp.period}
                                </div>
                            </div>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}>
                                {exp.achievements.map((achievement, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            padding: '15px 0',
                                            borderBottom: i < exp.achievements.length - 1 ? '1px solid #2a2a2a' : 'none',
                                            color: '#ccc',
                                            lineHeight: '1.8',
                                            display: 'flex',
                                            gap: '15px',
                                            fontSize: '16px'
                                        }}
                                    >
                                        <span style={{ color: '#FF6B00', fontWeight: '700', fontSize: '20px' }}>→</span>
                                        <span>{achievement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Portfolio/Projects Section */}
            <section id="portfolio" style={{
                padding: '100px 40px',
                background: '#1a1a1a'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '48px',
                        fontWeight: '700',
                        marginBottom: '60px',
                        textAlign: 'center'
                    }}>
                        My <span style={{ color: '#FF6B00' }}>Portfolio</span>
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                        gap: '40px'
                    }}>
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                style={{
                                    background: '#222',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: '1px solid #2a2a2a',
                                    transition: 'transform 0.3s',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '280px',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '20px',
                                        left: '20px',
                                        padding: '8px 20px',
                                        background: '#FF6B00',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#fff'
                                    }}>
                                        {project.type}
                                    </div>
                                </div>
                                <div style={{ padding: '35px' }}>
                                    <h3 style={{
                                        fontSize: '26px',
                                        fontWeight: '700',
                                        marginBottom: '15px',
                                        color: '#fff'
                                    }}>
                                        {project.title}
                                    </h3>
                                    <p style={{
                                        color: '#999',
                                        marginBottom: '20px',
                                        lineHeight: '1.7',
                                        fontSize: '15px'
                                    }}>
                                        {project.description}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '10px',
                                        marginBottom: '25px'
                                    }}>
                                        {project.tech.map((tech) => (
                                            <span
                                                key={tech}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: '#2a2a2a',
                                                    borderRadius: '8px',
                                                    fontSize: '13px',
                                                    color: '#FF6B00',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    <div style={{
                                        borderTop: '1px solid #2a2a2a',
                                        paddingTop: '20px'
                                    }}>
                                        <div style={{
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            color: '#FF6B00',
                                            marginBottom: '15px'
                                        }}>
                                            Key Features:
                                        </div>
                                        <ul style={{
                                            listStyle: 'none',
                                            padding: 0,
                                            margin: 0
                                        }}>
                                            {project.highlights.map((highlight, i) => (
                                                <li
                                                    key={i}
                                                    style={{
                                                        padding: '10px 0',
                                                        color: '#ccc',
                                                        fontSize: '14px',
                                                        lineHeight: '1.6',
                                                        display: 'flex',
                                                        gap: '12px'
                                                    }}
                                                >
                                                    <span style={{ color: '#FF6B00', fontSize: '18px' }}>✓</span>
                                                    <span>{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact-me" style={{
                padding: '100px 40px',
                background: '#202020'
            }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        fontSize: '48px',
                        fontWeight: '700',
                        marginBottom: '20px'
                    }}>
                        Let's Work <span style={{ color: '#FF6B00' }}>Together</span>
                    </h2>
                    <p style={{
                        color: '#999',
                        marginBottom: '40px',
                        fontSize: '18px',
                        lineHeight: '1.8'
                    }}>
                        I'm always open to discussing new projects, opportunities, or collaborations.
                        Feel free to reach out!
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        marginBottom: '40px',
                        flexWrap: 'wrap'
                    }}>
                        <a href="mailto:anmolmehla4@gmail.com" style={{
                            padding: '14px 18px',
                            background: '#222',
                            border: '1px solid #2a2a2a',
                            borderRadius: '10px',
                            color: '#999',
                            textDecoration: 'none',
                            fontSize: '15px',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#FF6B00';
                                e.currentTarget.style.color = '#FF6B00';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = '#2a2a2a';
                                e.currentTarget.style.color = '#999';
                            }}
                        >
                            ✉️ anmolmehla4@gmail.com
                        </a>
                        <a href="tel:9991867163" style={{
                            padding: '14px 18px',
                            background: '#222',
                            border: '1px solid #2a2a2a',
                            borderRadius: '10px',
                            color: '#999',
                            textDecoration: 'none',
                            fontSize: '15px',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#FF6B00';
                                e.currentTarget.style.color = '#FF6B00';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = '#2a2a2a';
                                e.currentTarget.style.color = '#999';
                            }}
                        >
                            📞 9991867163
                        </a>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <a href="mailto:anmolmehla4@gmail.com" style={{
                            padding: '16px 50px',
                            background: '#FF6B00',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            textDecoration: 'none',
                            display: 'inline-block'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Get In Touch
                        </a>
                        <a href="https://linkedin.com/in/anmehla09" target="_blank" rel="noopener noreferrer" style={{
                            padding: '16px 50px',
                            background: 'transparent',
                            border: '2px solid #3a3a3a',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textDecoration: 'none',
                            display: 'inline-block'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#FF6B00';
                                e.currentTarget.style.color = '#FF6B00';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = '#3a3a3a';
                                e.currentTarget.style.color = '#fff';
                            }}
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '40px 20px',
                textAlign: 'center',
                borderTop: '1px solid #2a2a2a',
                color: '#666',
                background: '#1a1a1a'
            }}>
                <p style={{ margin: 0 }}>© 2026 Anmol Mehla. All rights reserved.</p>
            </footer>
        </div>
    );
}