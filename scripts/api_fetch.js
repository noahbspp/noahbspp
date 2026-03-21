async function fetchGitHubStats() {
    const username = 'transcrimee';
    const fmt = (num) => num >= 1000 ? (num / 1000).toFixed(1) + 'k' : (num || 0);

    try {
        // Fetch User and Repos
        const [userRes, repoRes] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`),
            fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
        ]);
        
        const user = await userRes.json();
        const repos = await repoRes.json();

        // 1. Populate Profile Stats
        if (userRes.ok) {
            document.getElementById('github-name').innerText = user.login || 'N/A';
            document.getElementById('followers').innerText = fmt(user.followers);
            document.getElementById('repos').innerText = fmt(user.public_repos);
            document.getElementById('following').innerText = fmt(user.following);
            
            const avatar = document.getElementById('user-avatar');
            const card = document.querySelector('.stats-card');

            if (avatar) avatar.style.backgroundImage = `url(${user.avatar_url})`;
            if (card) card.style.setProperty('--bg-img', `url(${user.avatar_url})`);
        }

        // 2. Populate Repository & Commit Stats
        if (repoRes.ok && Array.isArray(repos)) {
            const stars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
            const forks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
            
            // --- NEW: Fetch Commits for ALL repos ---
           const res = await fetch(`https://awesome-github-stats.azurewebsites.net/user-stats/transcrimee/rank`)
           const data = await res.json();
           
           const totalCommits = data.userStats.commits;
            // ---------------------------------------

            const langs = repos.map(r => r.language).filter(l => l);
            const topLang = langs.length 
                ? langs.sort((a,b) => langs.filter(v => v===a).length - langs.filter(v => v===b).length).pop() 
                : 'N/A';
            
            // Injecting the data
            document.getElementById('repo-stars').innerText = fmt(stars);
            document.getElementById('repo-forks').innerText = fmt(forks);
            document.getElementById('repo-lang').innerText = topLang;
            document.getElementById('repo-commits').innerText = fmt(totalCommits); // Fixed the undefined error
            document.getElementById('repo-name').innerText = "All Public Projects";
        }
    } catch (e) { 
        console.error("GitHub API Error:", e); 
    }
}

window.addEventListener('DOMContentLoaded', fetchGitHubStats);
