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
                                src="data:image/jpeg;base64,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"
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