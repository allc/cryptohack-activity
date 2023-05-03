import ActivityCalendar, { Activity, Level } from 'react-activity-calendar'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { Tooltip as MuiTooltip } from '@mui/material'
import { useRouter } from 'next/router'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [activities, setActivities] = useState<Activity[][]>([])
  const router = useRouter()

  useEffect(() => {
    const username = router.query.user
    if (username == undefined || username == '') {
      return
    }
    fetch(`https://cryptohack.org/api/user/${username}/`)
      .then(res => res.json())
      .then(data => {
        const solvedChallenges = data.solved_challenges;
        const activities_: { [key: number]: { [key: string]: number } } = {}
        for (const activity of solvedChallenges) {
          const date = new Date(activity.date)
          const year = date.getFullYear()
          if (activities_[year] == undefined) {
            activities_[year] = {}
            activities_[year][`${year}-01-01`] = 0
            const currentDate = new Date()
            if (year < currentDate.getFullYear()) {
              activities_[year][`${year}-12-31`] = 0
            } else {
              activities_[year][currentDate.toISOString().split('T')[0]] = 0
            }
          }
          const key = date.toISOString().split('T')[0]
          if (activities_[year][key] == undefined) {
            activities_[year][key] = 0
          }
          activities_[year][key] += 1
        }
        let max = 1
        for (const year in activities_) {
          for (const key in activities_[year]) {
            max = Math.max(max, activities_[year][key])
          }
        }
        const activitiesList: Activity[][] = []
        for (const year in activities_) {
          let activitiesListYear: Activity[] = []
          let keys = Object.keys(activities_[year])
          keys = keys.sort()
          for (const key of keys) {
            const count = activities_[year][key]
            const level_ = count > 0 ? Math.floor(count / max * 3) + 1 : 0
            let level: Level = 0
            switch (level_) {
              case 1:
                level = 1
                break
              case 2:
                level = 2
                break
              case 3:
                level = 3
                break
              case 4:
                level = 4
                break
              default:
                break
            }
            activitiesListYear.push({
              date: key,
              count: count,
              level: level,
            })
          }
          activitiesList.push(activitiesListYear)
        }
        activitiesList.reverse()
        setActivities(activitiesList)
      })
  }, [router])

  return (
    <main>
      <h1>CryptoHack Activity</h1>
      <p>
        <i>Disclaimer: this site is not associated with or endorsed by CryptoHack.</i>
      </p>
      <p>
        Usage: <code>https://www.cjxol.com/cryptohack-activity?user=[your CryptoHack username]</code>
      </p>
      <p>
        <Link href="https://github.com/allc/cryptohack-activity">View on GitHub</Link>
      </p>
      <div>
        {activities.map((activity: Activity[], i: any) => 
          <ActivityCalendar
            key={i}
            data={activity}
            theme={{
              dark: ['#161b22', '#39d353'],
              light: ['#ebedf0', '#216e39']
            }}
            renderBlock={(block, activity) => (
              <MuiTooltip title={`${activity.count} challenges solved on ${activity.date}`}>
                {block}
              </MuiTooltip>
            )}
          />
        )}
      </div>
    </main>
  )
}
