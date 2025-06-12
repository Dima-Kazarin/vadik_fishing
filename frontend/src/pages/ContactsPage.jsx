const ContactsPage = () => {
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#333',
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '1.5rem',
        fontSize: '1.8rem',
        color: '#222',
      }}>
        📞 Контакти
      </h2>

      <div style={{
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
          <strong>Телеграм:</strong>{' '}
          <a href="https://t.me/vadikdrop" target="_blank" rel="noopener noreferrer" style={{ color: '#0088cc', textDecoration: 'none' }}>
            @vadikdrop
          </a>
        </p>
        <p style={{ fontSize: '1.1rem' }}>
          <strong>Номер телефону:</strong>{' '}
          <a href="tel:0967072553" style={{ color: '#28a745', textDecoration: 'none' }}>
            0967072553
          </a>
        </p>
      </div>
    </div>
  );
};

export default ContactsPage;
