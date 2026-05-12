import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyA1sA2PoJu6Jeg7ueweMLUGDcdC_5nt7iE",
  authDomain: "uae-identity-forum.firebaseapp.com",
  projectId: "uae-identity-forum",
  storageBucket: "uae-identity-forum.firebasestorage.app",
  messagingSenderId: "907139444102",
  appId: "1:907139444102:web:a0c97acf68404cb94c5007",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const sections = [
    {
      id: "space",
      title: "🚀 الابتكار و الفضاء الإماراتي",
      image:
        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600",
    },

    {
      id: "environment",
      title: "🌱 الاستدامة و العلوم البيئية",
      image:
        "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1600",
    },

    {
      id: "culture",
      title: "🏛️ الثقافة و التراث الإماراتي",
      image:
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1600",
    },
  ];

  const [selectedSection, setSelectedSection] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsCount, setPostsCount] = useState({});

useEffect(() => {
  const loadCounts = async () => {
    let counts = {};

    for (let section of sections) {
      const data = await getDocs(collection(db, section.id));
      counts[section.id] = data.docs.length;
    }

    setPostsCount(counts);
  };

  loadCounts();
}, []);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
const loadCounts = async () => {
  let counts = {};

  for (let section of sections) {
    const data = await getDocs(collection(db, section.id));
    counts[section.id] = data.docs.length;
  }

  setPostsCount(counts);
};
  const loadPosts = async (sectionId) => {
    const data = await getDocs(collection(db, sectionId));
setPosts(
  data.docs
    .map((docItem) => ({
      ...docItem.data(),
      id: docItem.id,
    }))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
);};

 useEffect(() => {
  if (selectedSection) {
    loadPosts(selectedSection.id);
  }

  loadCounts();
}, []);

  const handlePaste = (e) => {
    const items = e.clipboardData.items;

    for (let item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();

        const reader = new FileReader();

        reader.onloadend = () => {
          setImage(reader.result);
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const addPost = async () => {
    if (!content) return;

    await addDoc(collection(db, selectedSection.id), {
      content,
      image,
      likes: 0,
      comments: [],
      createdAt: Date.now(),
date: new Date().toLocaleString("ar-EG"),
    });

    setContent("");
    setImage("");

  await loadPosts(selectedSection.id);
    await loadCounts();
  };

  const likePost = async (post) => {
    const ref = doc(db, selectedSection.id, post.id);

    await updateDoc(ref, {
      likes: (post.likes || 0) + 1,
    });

    loadPosts(selectedSection.id);
  };

  const addComment = async (post) => {
    const text = commentInputs[post.id];

    if (!text) return;

    const ref = doc(db, selectedSection.id, post.id);

    await updateDoc(ref, {
      comments: [...(post.comments || []), text],
    });

    setCommentInputs({
      ...commentInputs,
      [post.id]: "",
    });

    loadPosts(selectedSection.id);
  };

  const deletePost = async (id) => {
    await deleteDoc(doc(db, selectedSection.id, id));

    loadPosts(selectedSection.id);
  };

  const saveEdit = async () => {
    const ref = doc(db, selectedSection.id, editingPost.id);

    await updateDoc(ref, {
      content: editContent,
    });

    setEditingPost(null);
    setEditContent("");

    loadPosts(selectedSection.id);
  };

  if (selectedSection) {
    return (
      <div
        style={{
          background:
            "linear-gradient(135deg, #eef5ff 0%, #f7fbff 40%, #ecfff7 100%)",
          minHeight: "100vh",
          direction: "rtl",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.4)",
            padding: "20px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <h2 style={{ color: "#00b894" }}>منتدى الهوية الإماراتية</h2>

          <button
            onClick={() => setSelectedSection(null)}
            style={{
              background: "#00b894",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            الرئيسية
          </button>
        </div>

        <div
          style={{
            backgroundImage: `url(${selectedSection.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "320px",
            position: "relative",
          }}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.45)",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                color: "white",
                fontSize: "50px",
              }}
            >
              {selectedSection.title}
            </h1>
          </div>
        </div>

        <div
          style={{
            maxWidth: "900px",
            margin: "40px auto",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.4)",
              padding: "25px",
              borderRadius: "25px",
              marginBottom: "30px",
            }}
          >
            <textarea
              placeholder="اكتب منشورك هنا..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              style={{
                width: "100%",
                minHeight: "140px",
                border: "none",
                outline: "none",
                resize: "none",
                fontSize: "18px",
                background: "#f5f6fa",
                borderRadius: "15px",
                padding: "15px",
              }}
            />

            {image && (
              <img
                src={image}
                alt=""
                style={{
                  width: "100%",
                  borderRadius: "20px",
                  marginTop: "20px",
                }}
              />
            )}

            <button
type="button"
              onClick={addPost}
              style={{
                marginTop: "20px",
                background: "#00b894",
                color: "white",
                border: "none",
                padding: "15px 25px",
                borderRadius: "15px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              نشر المنشور 🚀
            </button>
          </div>

          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.4)",
                borderRadius: "25px",
                padding: "25px",
                marginBottom: "25px",
              }}
            >
              {editingPost?.id === post.id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{
                      width: "100%",
                      minHeight: "120px",
                      borderRadius: "15px",
                      border: "none",
                      background: "#f5f6fa",
                      padding: "15px",
                    }}
                  />

                  <button
                    onClick={saveEdit}
                    style={{
                      marginTop: "15px",
                      background: "#00b894",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: "12px",
                      cursor: "pointer",
                    }}
                  >
                    حفظ التعديل
                  </button>
                </>
              ) : (
                <>
                  <p
                    style={{
                      fontSize: "18px",
                      lineHeight: "1.9",
                    }}
                  >
                    {post.content}
                  </p>

                  {post.image && (
                    <img
                      src={post.image}
                      alt=""
                      style={{
                        width: "100%",
                        borderRadius: "20px",
                        marginTop: "20px",
                      }}
                    />
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => likePost(post)}
                      style={{
                        background: "#eefaf7",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}
                    >
                      ❤️ {post.likes || 0}
                    </button>

                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setEditContent(post.content);
                      }}
                      style={{
                        background: "#eef3ff",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}
                    >
                      ✏ تعديل
                    </button>

                    <button
                      onClick={() => deletePost(post.id)}
                      style={{
                        background: "#ffecec",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}
                    >
                      🗑 حذف
                    </button>
                  </div>

                  <div style={{ marginTop: "25px" }}>
                    <input
                      type="text"
                      placeholder="أضف تعليق..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) =>
                        setCommentInputs({
                          ...commentInputs,
                          [post.id]: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "12px",
                        border: "none",
                        background: "#f5f6fa",
                        marginBottom: "12px",
                      }}
                    />

                    <button
                      onClick={() => addComment(post)}
                      style={{
                        background: "#00b894",
                        color: "white",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}
                    >
                      إضافة تعليق
                    </button>

                    <div style={{ marginTop: "15px" }}>
                      {(post.comments || []).map((comment, index) => (
                        <div
                          key={index}
                          style={{
                            background: "#f5f6fa",
                            padding: "12px",
                            borderRadius: "12px",
                            marginBottom: "10px",
                          }}
                        >
                          {comment}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef5ff 0%, #f7fbff 40%, #ecfff7 100%)",
        padding: "40px",
        direction: "rtl",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.4)",
          padding: "20px 30px",
          borderRadius: "25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "50px",
        }}
      >
        <h1
          style={{
            color: "#00b894",
            fontSize: "50px",
          }}
        >
          منتدى الهوية الإماراتية 
        </h1>

        <button
          style={{
            background: "#00b894",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "12px",
          }}
        >
          الأقسام
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: "30px",
        }}
      >
        {sections.map((section) => (
          <div
            key={section.id}
            onClick={() => setSelectedSection(section)}
            style={{
              height: "420px",
              borderRadius: "35px",
              overflow: "hidden",
              cursor: "pointer",
              backgroundImage: `url(${section.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              transition: "0.3s",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.15))",
                display: "flex",
                alignItems: "flex-end",
                padding: "30px",
              }}
            >
              <div>
                <h2
                  style={{
                    color: "white",
                    fontSize: "35px",
                    marginBottom: "12px",
                  }}
                >
                  {section.title}
                </h2>

                <div
                  style={{
                    background: "rgba(255,255,255,0.22)",
                    backdropFilter: "blur(6px)",
                    padding: "8px 14px",
                    borderRadius: "14px",
                    width: "fit-content",
                    color: "white",
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                >
                  📌 عدد المشاركات: {postsCount[section.id] || 0}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
